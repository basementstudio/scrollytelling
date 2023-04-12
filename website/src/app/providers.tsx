"use client";

import { useEffect } from "react";
import { useAppStore } from "../context/use-app-store";
import { useIsoLayoutEffect } from "./hooks/use-iso-layout-effect";
import { useProgress } from "@react-three/drei";

const useFontsLoaded = () => {
  useEffect(() => {
    const maxWaitTime = 1500; // tweak this as needed.

    const timeout = window.setTimeout(() => {
      onReady();
    }, maxWaitTime);

    function onReady() {
      window.clearTimeout(timeout);
      useAppStore.setState({ fontsLoaded: true });
      document.documentElement.classList.add("fonts-loaded");
    }

    try {
      document.fonts.ready
        .then(() => {
          onReady();
        })
        .catch((error: unknown) => {
          console.error(error);
          onReady();
        });
    } catch (error) {
      console.error(error);
      onReady();
    }
  }, []);
};

const useLoader = () => {
  const { active } = useProgress();

  useIsoLayoutEffect(() => {
    useAppStore.setState({ loading: false });
  }, [active]);

  return null;
};

export const Providers = ({ children }: { children?: React.ReactNode }) => {
  useFontsLoaded();
  useLoader();

  return <>{children}</>;
};
