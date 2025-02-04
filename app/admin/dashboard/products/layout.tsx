import { ReactNode } from "react";

export default function AdminDashboardProductsLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}
