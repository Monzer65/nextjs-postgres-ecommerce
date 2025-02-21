"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UploadedFile {
  public_id: string;
  secure_url: string;
}

interface ImageUploadProps {
  onUploadSuccess?: (fileInfo: UploadedFile) => void; // Callback for successful upload
  onRemoveFile?: (publicId: string) => void; // Callback for file removal
}

export default function ImageUpload({
  onUploadSuccess,
  onRemoveFile,
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  function removeFile(publicId: string) {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.public_id !== publicId),
    );

    // Call the callback to notify parent about file removal
    if (onRemoveFile) {
      onRemoveFile(publicId);
    }

    toast({
      title: "Image removed",
      description: "The image has been successfully removed.",
    });
  }

  useEffect(() => {
    console.log("Updated uploadedFiles:", uploadedFiles);
  }, [uploadedFiles]);

  return (
    <Card className="w-full max-w-lg my-4">
      <CardContent className="p-6">
        <CldUploadWidget
          uploadPreset="shopsy"
          onSuccess={(result) => {
            console.log("Upload Success:", result);

            if (
              result?.info &&
              typeof result.info === "object" &&
              "public_id" in result.info &&
              "secure_url" in result.info
            ) {
              const fileInfo = result.info as UploadedFile;
              setUploadedFiles((prev) => [...prev, fileInfo]);

              // Call the callback with the uploaded file info
              if (onUploadSuccess) {
                onUploadSuccess(fileInfo);
              }

              toast({
                title: "Upload successful",
                description: "Your image has been uploaded.",
              });
            }
          }}
          onError={(error) => {
            console.error("Upload error:", error);
            toast({
              title: "Upload failed",
              description:
                "There was an error uploading your image. Please try again.",
              variant: "destructive",
            });
          }}
          onQueuesEnd={() => {
            console.log("Upload Queue End");
            setIsUploading(false);
          }}
        >
          {({ open }) => {
            function handleOnClick() {
              console.log("Upload button clicked");
              open();
            }

            return (
              <div className="flex flex-col items-center gap-6">
                <Button
                  onClick={handleOnClick}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>

                {/* Preview Uploaded Images */}
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                    {uploadedFiles.map((file) => (
                      <div key={file.public_id} className="relative group">
                        <CldImage
                          src={file.secure_url}
                          alt="Uploaded Image"
                          width={150}
                          height={150}
                          className="rounded-md object-cover w-full h-full"
                        />
                        <Button
                          onClick={() => removeFile(file.public_id)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          size="icon"
                          variant="destructive"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        </CldUploadWidget>
      </CardContent>
    </Card>
  );
}
