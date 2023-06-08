import { gsap } from "gsap";
// ---- Hooks ----
import { useIsoLayoutEffect } from "../../hooks/use-iso-layout-effect";

// ---- Types ----
import { Plugin } from "../../types";

/* -------------------------------------------------------------------------------------------------
 * RegisterGsapPlugins
 * -----------------------------------------------------------------------------------------------*/

interface RegisterGsapPluginsProps {
  plugins: Plugin[];
}

/**
 * RegisterGsapPlugins registers GSAP plugins.
 *
 * @param {RegisterGsapPluginsProps} props - RegisterGsapPlugins component props
 * @returns {null}
 * @link https://github.com/basementstudio/scrollytelling/blob/main/docs/api.md#register-plugin
 */

export const RegisterGsapPlugins = ({ plugins }: RegisterGsapPluginsProps) => {
  // This needs to run before ScrollTrigger does any animations
  useIsoLayoutEffect(() => {
    gsap.registerPlugin(...plugins);
  }, []);

  return null;
};
