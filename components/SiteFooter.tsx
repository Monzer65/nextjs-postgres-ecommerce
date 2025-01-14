// Footer.tsx

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className='border-t dark:bg-background bg-slate-800 text-white'>
      <div className='flex flex-col gap-6 md:flex-row md:gap-8 p-3'>
        <div className='flex-1 space-y-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='inline-block font-bold'>شاپزی</span>
          </Link>
          <p className='text-sm text-gray-100'>فروشگاه پرده آماده</p>
        </div>
        <div className='grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3'>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>فروشگاه</h3>
            <ul className='space-y-1'>
              <li>
                <Link
                  href='/categories/electronics'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  پرده
                </Link>
              </li>
              <li>
                <Link
                  href='/categories/clothing'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  لوازم جانبی پرده
                </Link>
              </li>
              <li>
                <Link
                  href='/categories/home'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  روشنایی
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>شاپزی</h3>
            <ul className='space-y-1'>
              <li>
                <Link
                  href='/about'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  درباره
                </Link>
              </li>
              <li>
                <Link
                  href='/careers'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  استخدام
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  تماس
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>قوانین</h3>
            <ul className='space-y-1'>
              <li>
                <Link
                  href='/privacy'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  سیاست حفظ حریم خصوصی
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-sm text-gray-100 hover:underline hover:underline-offset-4'
                >
                  شرایط استفاده
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Separator />
      <div className='flex flex-col gap-4 md:flex-row md:items-center p-3'>
        <div className='flex-1 text-sm text-gray-100'>
          © {new Date().getFullYear()} تمام حقوق محفوظ است.
        </div>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon'>
            <Facebook className='h-5 w-5' />
            <span className='sr-only'>Facebook</span>
          </Button>
          <Button variant='ghost' size='icon'>
            <Instagram className='h-5 w-5' />
            <span className='sr-only'>Instagram</span>
          </Button>
          <Button variant='ghost' size='icon'>
            <Twitter className='h-5 w-5' />
            <span className='sr-only'>Twitter</span>
          </Button>
        </div>
      </div>
    </footer>
  );
};
