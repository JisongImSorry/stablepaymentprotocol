import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-blue-400 border-b border-black ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="flex flex-1">
                <div className="flex flex-shrink-0 items-center text-white font-semibold text-2xl">
                  <p>Stable Payment Protocol</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}

declare global {
  interface Window {
    ethereum: any
  }
}
