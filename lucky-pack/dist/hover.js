// Local pointer feedback: one scheduled update per surface, no continuous loop.
const prepared = new WeakSet();
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const activeSurfaces = new Set();
const pointerProperties = ['--hover-x','--hover-y','--tilt-x','--tilt-y','--magnet-x','--magnet-y','--art-x','--art-y'];

function prepareSurface(element, tilt = 0) {
  if(prepared.has(element)) return;
  prepared.add(element);
  let frame = 0;
  let point = null;
  function reset() {
    if(frame) cancelAnimationFrame(frame);
    frame = 0;
    point = null;
    element.classList.remove('is-hovered');
    for(const property of pointerProperties) element.style.removeProperty(property);
    activeSurfaces.delete(reset);
  }
  element.addEventListener('pointermove',event=>{
    if(event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) return;
    point = {x:event.clientX,y:event.clientY};
    if(frame) return;
    frame = requestAnimationFrame(()=>{
      frame = 0;
      if(!point || !element.isConnected) { reset(); return; }
      const bounds = element.getBoundingClientRect();
      if(!bounds.width || !bounds.height) return;
      const x = Math.max(0,Math.min(1,(point.x-bounds.left)/bounds.width));
      const y = Math.max(0,Math.min(1,(point.y-bounds.top)/bounds.height));
      element.style.setProperty('--hover-x',`${(x*100).toFixed(2)}%`);
      element.style.setProperty('--hover-y',`${(y*100).toFixed(2)}%`);
      if(tilt) {
        element.style.setProperty('--magnet-x',`${((x-.5)*10).toFixed(2)}px`);
        element.style.setProperty('--magnet-y',`${((y-.5)*8).toFixed(2)}px`);
        element.style.setProperty('--art-x',`${((.5-x)*9).toFixed(2)}px`);
        element.style.setProperty('--art-y',`${((.5-y)*7).toFixed(2)}px`);
        element.style.setProperty('--tilt-x',`${((.5-y)*tilt).toFixed(2)}deg`);
        element.style.setProperty('--tilt-y',`${((x-.5)*tilt).toFixed(2)}deg`);
      }
      element.classList.add('is-hovered');
      activeSurfaces.add(reset);
    });
  },{passive:true});
  element.addEventListener('pointerleave',reset);
  element.addEventListener('pointercancel',reset);
  element.addEventListener('blur',reset);
}
function resetActiveSurfaces(){for(const reset of [...activeSurfaces]) reset();}
finePointer.addEventListener('change',resetActiveSurfaces);
reducedMotion.addEventListener('change',resetActiveSurfaces);
window.addEventListener('blur',resetActiveSurfaces);
document.addEventListener('visibilitychange',()=>{if(document.hidden) resetActiveSurfaces();});

export function initHoverEffects(root = document) {
  for(const element of root.querySelectorAll('.pack-stage,.opening-stage .pack,.primary-button,.secondary-button,.icon-button')) prepareSurface(element);
  for(const element of root.querySelectorAll('.pack-choice')) prepareSurface(element,24);
  for(const element of root.querySelectorAll('.fortune-card')) prepareSurface(element,18);
  for(const element of root.querySelectorAll('.collection-item')) prepareSurface(element,8);
}
