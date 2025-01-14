import HeaderAdmin from "@/components/admin-header";

export default function AddNewProductPage() {
    const items = [
        { href: "/admin", label: "خانه" },
        { href: "/admin/dashboard", label: "داشبورد" },
        { href: "/admin/dashboard/products", label: "محصولات" },
        { label: "محصول جدید" },
    ]
    return (
        <>
            <HeaderAdmin items={items} itemsToDisplay={3} />
            <div className="flex-1 overflow-auto">
                <main className="p-6">
                    <h1 className="text-3xl font-bold mb-6">افزودن محصول جدید</h1>
                    {/*form goes here*/}
                </main>
            </div>
        </>
    );
}