import localFont from "next/font/local";

const vazirmatn = localFont({
    src: "../fonts/Vazirmatn-Regular.woff2",
    variable: "--font-vazirmatn-regular",
    weight: "400, 700",
});

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className={`${vazirmatn.className} antialiased`}>{children}</div>;
}
