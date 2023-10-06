import { NextRequest } from 'next/server'
import { getSession } from "next-auth/react";
import { isTokenExpired } from "./tokenCheck";
 
// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ['/blogs/editor', '/blogs/create','/sponsorships/create','/jobs/create','/events/create','/users/info', '/users/years'],
}
 
export async function middleware(request: NextRequest) {
  const session = await getSession();
  console.log("session:  " + session);
  const token = session?.user?.token;
    console.log("in middleware");

    console.log(token);
    // Check if the token is expired using your isTokenExpired function
    if (!token) {
      console.log("invalid token");
    }
    if (token && isTokenExpired(token)) {
      // Respond with JSON indicating a token expired message
        return new Response(
        JSON.stringify({ success: false, message: 'Token has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
  }

  console.log("token not expired");
}