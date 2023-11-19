import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';


// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ['/blogs/editor', 
  '/blogs/create', 
  '/sponsorships/create', 
  '/jobs/create', 
  '/events/create', 
  '/users/info', 
  '/users/years', 
  '/profile',
  '/companies/create', 
  '/settings/coverphoto',
  '/resources/create'
  ],
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req })

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  if (token && token.exp) {
    const exp =  new Date(token.exp as number* 1000);
    const currentTime = new Date();

    if(exp < currentTime) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
}