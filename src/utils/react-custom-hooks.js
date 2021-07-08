import { useEffect } from 'react';

/**
 * Instead of doing this:
 * <pre>
 *   useEffect( () => {
 *     let mounted = true;
 *
 *     fetch(...).then(res=>{
 *       if (mounted){
 *         setState(res)
 *       }
 *     });
 *
 *     return ()=>{
 *       mounted = false;
 *     }
 *   })
 * </pre>
 * You'll do this:
 * <pre>
 *   useWrappedEffect( callback => {
 *     fetch(...).then(callback(setState));
 *   })
 * </pre>
 *
 * @param { function }  effect
 * @param { array }       deps
 * @returns void
 */
function useWrappedEffect (effect, deps) {
  useEffect(() => {
    let mounted = false;

    const callback = (onMountedFn, onUnmountedFn) => {
      return (...argArray) => {
        if (mounted) {
          onMountedFn(...argArray);
        } else if (onUnmountedFn) {
          onUnmountedFn();
        }
      };
    };

    const destructor = effect(callback);

    mounted = true;

    return () => {
      mounted = false;

      if (destructor) destructor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}

export { useWrappedEffect };
