import jwtDecode, { JwtPayload } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
    const decodedToken: JwtPayload | undefined = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  
    // Check if the "exp" claim exists and is a valid number
    //console.log("token expiry" + decodedToken.exp);

    const expirationTimestamp = decodedToken.exp * 1000; // Convert to milliseconds
    const expirationDate = new Date(expirationTimestamp);

    console.log("Token expiry time: " + expirationDate);

    if (decodedToken && typeof decodedToken.exp === 'number') {
      return decodedToken.exp < currentTime;
    }
  
    // If "exp" is not present or not a valid number, consider the token expired
    return true;
}



