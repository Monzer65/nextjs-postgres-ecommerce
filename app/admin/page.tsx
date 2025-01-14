import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCurrentSession } from '@/lib/auth/session';
import Image from 'next/image';
import { LogoutButton } from '@/components/logout-button';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
    const { session, user, roles } = await getCurrentSession();

    if (!session) {
        return redirect('/auth');
    }

    const isAdmin = roles.some((role: { name: string }) => role.name.includes("Admin"));

    if (isAdmin) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                {/* Navigation */}
                <nav className="bg-blue-600 text-white p-4 shadow-lg">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link href="/admin" className="text-2xl font-bold flex items-center space-x-2 rtl:space-x-reverse">
                            <Image src="/flowers.png" alt="AdminDash Logo" width={40} height={40} />
                            <span>پنل ادمین</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="hover:text-gray-200 hover:underline underline-offset-8">فروشگاه</Link>
                            <Link href="/admin/dashboard" className="hover:text-gray-200 hover:underline underline-offset-8">داشبورد</Link>
                            <LogoutButton className='gap-1' />
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-grow">
                    <div className="container mx-auto px-4 py-12 text-center">
                        <h1 className="text-4xl font-bold mb-4">خوش اومدی {user.first_name || 'ادمین'}!</h1>
                        <p className="text-xl text-gray-600 mb-8">آماده مدیریت اپلیکیشنت هستی؟</p>
                        <Button size="lg" asChild>
                            <Link href="/admin/dashboard">برو به داشبورد</Link>
                        </Button>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-blue-600 text-white p-4 mt-8">
                    <div className="container mx-auto text-center">
                        <p>&copy; 2025 شاپزی. تمام حقوق محفوظ است.</p>
                    </div>
                </footer>
            </div>
        );
    }

    // Fallback for unauthorized users
    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 space-y-4">
            <p>شما اجازه دسترسی به این بخش را ندارید</p>
            <div >
                <span>ابتدا از حساب کاربری خود خارج شوید و سپس با حساب ادمین وارد شوید</span>
                <LogoutButton />
            </div>
        </div>
    );
}
