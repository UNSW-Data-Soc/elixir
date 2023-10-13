import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';


// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ['/blogs/editor', '/blogs/create', '/sponsorships/create', '/jobs/create', '/events/create', '/users/info', '/users/years'],
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req })
  

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  //console.log(token.exp)
  if (token && token.exp) {
   // let exp = new Date(token.exp as number * 1000);
    //console.log(exp);
    console.log(token.exp);
    const expirationTimeInSeconds = token.exp; // seconds
    /*const expirationTimeInMilliseconds = expirationTimeInSeconds as number * 1000;
    const exp = new Date(expirationTimeInMilliseconds);*/

        // Convert the epoch timestamp to AEST using Luxon
        const expAEST = DateTime.fromSeconds(expirationTimeInSeconds)
        .setZone('Australia/Sydney')
        .toFormat('yyyy-MM-dd HH:mm:ss');
  
      console.log("Token expiration time (AEST):", expAEST);
  
      const currentTime = DateTime.now().setZone('Australia/Sydney').toFormat('yyyy-MM-dd HH:mm:ss');
      console.log("Current time (AEST):", currentTime);


      const jwt = require('jsonwebtoken');
      const decodedToken = jwt.decode(token); // Replace 'token' with your actual token
      console.log("Decoded Token:", decodedToken);  

    //const currentTime = new Date();
    console.log("current time" + currentTime);
    if(expAEST < currentTime) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
}