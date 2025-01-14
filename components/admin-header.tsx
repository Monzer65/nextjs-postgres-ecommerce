import { BreadcrumbLinks } from "./bread-crumbs";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function HeaderAdmin({ items, itemsToDisplay }: { items: { href?: string; label: string }[]; itemsToDisplay: number }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <BreadcrumbLinks items={items} />
            </div>
        </header>
    )
}
