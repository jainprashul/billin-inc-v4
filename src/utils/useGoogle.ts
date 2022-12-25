import { useGoogleApi } from "react-gapi";
import { useEffect, useState } from "react";
const SCOPES = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.appdata"];
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

export const useGoogle = () => {
    const gapi = useGoogleApi({
        discoveryDocs : DISCOVERY_DOCS,
        scopes: SCOPES,
    });
    const auth = gapi?.auth2?.getAuthInstance();

    const [user , setUser] = useState<any>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);


    const signIn = async () => {
        await auth.signIn();
    }

    const signOut = async () => {
        await auth.signOut();
    }

    const updateSigninStatus = (isSignedIn: boolean) => {
        console.log('updateSigninStatus', isSignedIn);
        if(isSignedIn) {
            const currentUser = auth.currentUser.get();
            const profile = currentUser.getBasicProfile();
            setUser(profile);
            setIsSignedIn(true);
        }
        else {
            setUser(null);
            setIsSignedIn(false);
        }
    }

    useEffect(() => {
        if(auth) {
            auth.isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(auth.isSignedIn.get());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);


    return {
        signIn,
        signOut,
        updateSigninStatus,
        user, 
        isSignedIn,
        gapi,
    }
}