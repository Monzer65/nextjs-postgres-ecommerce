"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UploadedImages } from "./form";

interface ImageUploadProps {
  onUploadSuccess?: (fileInfo: UploadedImages) => void; // Callback for successful upload
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedImages[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Card className="w-full max-w-lg my-4">
      <CardContent className="p-6">
        <CldUploadWidget
          uploadPreset="shopsy"
          // Update the onSuccess handler
          onSuccess={(result) => {
            console.log("Upload Success:", result);

            if (
              result?.info &&
              typeof result.info === "object" &&
              "public_id" in result.info &&
              "secure_url" in result.info &&
              "url" in result.info &&
              "thumbnail_url" in result.info
            ) {
              const fileInfo = result.info as UploadedImages;

              // Check for duplicates before updating state
              setUploadedFiles((prev) => {
                const exists = prev.some(
                  (file) => file.public_id === fileInfo.public_id,
                );
                if (exists) {
                  toast({
                    title: "Duplicate Image",
                    description: "This image has already been uploaded.",
                    variant: "destructive",
                  });
                  return prev;
                }
                return [...prev, fileInfo];
              });

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

            // Log the error in a more readable format
            if (error instanceof Error) {
              console.error("Error message:", error.message);
              console.error("Stack trace:", error.stack);
            } else {
              console.error(
                "Full error object:",
                JSON.stringify(error, null, 2),
              );
            }

            toast({
              title: "Upload failed",
              description:
                "There was an error uploading your image. Please check the console for more details.",
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
                      <Upload className="w-4 h-4" />
                      آپلود تصاویر
                    </>
                  )}
                </Button>
              </div>
            );
          }}
        </CldUploadWidget>
      </CardContent>
    </Card>
  );
}
