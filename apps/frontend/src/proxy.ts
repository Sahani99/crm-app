// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const isAuthPage = pathname.startsWith('/login');
//   const token = request.cookies.get('access_token')?.value;

//   if (!isAuthPage && !token) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (isAuthPage && token) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  return NextResponse.next();
}