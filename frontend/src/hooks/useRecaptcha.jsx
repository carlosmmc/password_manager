import {useEffect, useState} from "react";
import {
    getMultiFactorResolver,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    RecaptchaVerifier,
    signInWithEmailAndPassword
  } from "firebase/auth";
import {auth} from "../firebase";

export default function useRecaptcha(componentId) {
    // const appVer = new ApplicationVerifier()
    const [recaptcha, setRecaptcha] = useState()

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, componentId, {
            "size": "invisible",
            "callback": () => {}
        });

        setRecaptcha(recaptchaVerifier);

        return () => {
            recaptchaVerifier.clear();
        }
    }, [componentId]);

    return recaptcha;
}