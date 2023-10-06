import { getSession } from "next-auth/react";
import jwtDecode, { JwtPayload } from 'jwt-decode'

export function isTokenExpired(token: string): boolean {
    console.log("checking expiry time");

    const decodedToken: JwtPayload | undefined = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    console.log("checking expiry time");
    // Check if the "exp" claim exists and is a valid number
    console.log("token expiry" + decodedToken.exp);

    console.log ("the current time" + currentTime);
    if (decodedToken && typeof decodedToken.exp === 'number') {
      const expirationTimestamp = decodedToken.exp * 1000; // Convert to milliseconds
      const expirationDate = new Date(expirationTimestamp);
      console.log("Token expiry time: " + expirationDate);
      return decodedToken.exp < currentTime;
    }
  
    // If "exp" is not present or not a valid number, consider the token expired
    return true;
}