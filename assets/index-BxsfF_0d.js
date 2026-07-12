(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(n){if(n.ep)return;n.ep=!0;const l=e(n);fetch(n.href,l)}})();const A=[{id:"push-day",name:"Push Day",exercises:[{id:"ex-bench-press",name:"Incline Barbell Bench Press",targetSets:4,targetReps:10,targetWeight:40,restTimeSec:90},{id:"ex-ohp",name:"Machine Chest Press",targetSets:4,targetReps:10,targetWeight:55,restTimeSec:90},{id:"ex-incline-db",name:"Incline Dumbbell Press",targetSets:3,targetReps:12,targetWeight:28,restTimeSec:60},{id:"ex-tricep-pushdown",name:"Cable Tricep Pushdowns",targetSets:4,targetReps:15,targetWeight:35,restTimeSec:60}]},{id:"pull-day",name:"Pull Day",exercises:[{id:"ex-lat-pulldown",name:"Wide-Grip Lat Pulldown",targetSets:4,targetReps:10,targetWeight:65,restTimeSec:90},{id:"ex-barbell-row",name:"Bent-Over Barbell Row",targetSets:4,targetReps:8,targetWeight:75,restTimeSec:90},{id:"ex-face-pull",name:"Rope Face Pulls",targetSets:3,targetReps:15,targetWeight:25,restTimeSec:60},{id:"ex-bicep-curl",name:"EZ-Bar Bicep Curls",targetSets:3,targetReps:12,targetWeight:30,restTimeSec:60}]},{id:"leg-day",name:"Leg Day",exercises:[{id:"ex-squat",name:"Barbell Back Squat",targetSets:4,targetReps:8,targetWeight:100,restTimeSec:120},{id:"ex-rdl",name:"Romanian Deadlift (RDL)",targetSets:3,targetReps:10,targetWeight:90,restTimeSec:90},{id:"ex-leg-extension",name:"Machine Leg Extension",targetSets:3,targetReps:15,targetWeight:55,restTimeSec:60},{id:"ex-calf-raise",name:"Standing Calf Raises",targetSets:4,targetReps:15,targetWeight:80,restTimeSec:60}]}],N={unit:"kg",soundEnabled:!0,defaultRestTimeSec:90};class j{constructor(){this.overlayEl=null,this.init()}init(){const t=document.getElementById("modal-root");this.overlayEl=document.createElement("div"),this.overlayEl.className="modal-overlay",t.appendChild(this.overlayEl),this.overlayEl.addEventListener("click",e=>{e.target===this.overlayEl&&this.close()})}open(t){this.overlayEl.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        ${t}
      </div>
    `,this.overlayEl.classList.add("open")}close(){this.overlayEl.classList.remove("open")}showAddRoutineModal(t){this.open(`
      <h3 style="font-size: 20px; margin-bottom: 16px;">Create New Routine Day</h3>
      <div class="form-group">
        <label class="form-label">Routine Name (e.g., Push Day, Cardio & Abs)</label>
        <input type="text" id="modal-routine-name" class="form-input" placeholder="e.g. Upper Body Power" autocomplete="off" />
      </div>
      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <button class="btn btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" id="modal-save-routine-btn">Create Routine</button>
      </div>
    `),this.overlayEl.querySelector("#modal-cancel-btn").addEventListener("click",()=>this.close());const o=this.overlayEl.querySelector("#modal-routine-name");o.focus(),this.overlayEl.querySelector("#modal-save-routine-btn").addEventListener("click",()=>{const n=o.value.trim();if(!n)return;const l={id:"routine_"+Date.now(),name:n,exercises:[]};p.addRoutine(l),t&&t(l),this.close()})}showExerciseModal(t,e=null,o){const n=!!e,r=p.getSettings().unit||"kg",y=e?e.name:"",u=e?e.targetSets:4,x=e?e.targetReps:10,i=e?e.targetWeight:60,a=e?e.restTimeSec:90,d=e&&e.unit?e.unit:r,f=`
      <h3 style="font-size: 20px; margin-bottom: 16px;">${n?"Edit Exercise":"Add New Exercise"}</h3>
      
      <div class="form-group">
        <label class="form-label">Exercise Name</label>
        <input type="text" id="ex-name-input" class="form-input" placeholder="e.g. Dumbbell Incline Press" value="${y}" autocomplete="off" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Target Sets</label>
          <input type="number" id="ex-sets-input" class="form-input" value="${u}" min="1" max="20" />
        </div>
        <div class="form-group">
          <label class="form-label">Target Reps</label>
          <input type="number" id="ex-reps-input" class="form-input" value="${x}" min="1" max="100" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Target Weight & Unit</label>
          <div style="display: flex; gap: 6px;">
            <input type="number" id="ex-weight-input" class="form-input" value="${i}" min="0" step="0.5" style="flex: 1;" />
            <select id="ex-unit-input" class="form-select" style="width: 78px; padding: 10px 6px; font-weight: 700; text-transform: uppercase;">
              <option value="kg" ${d==="kg"?"selected":""}>KG</option>
              <option value="lbs" ${d==="lbs"?"selected":""}>LBS</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Rest Time (sec)</label>
          <select id="ex-rest-input" class="form-select">
            <option value="30" ${a===30?"selected":""}>30 sec</option>
            <option value="60" ${a===60?"selected":""}>60 sec</option>
            <option value="90" ${a===90?"selected":""}>90 sec (1.5 min)</option>
            <option value="120" ${a===120?"selected":""}>120 sec (2 min)</option>
            <option value="180" ${a===180?"selected":""}>180 sec (3 min)</option>
            <option value="300" ${a===300?"selected":""}>300 sec (5 min)</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <button class="btn btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" id="modal-save-ex-btn">${n?"Save Changes":"Add Exercise"}</button>
      </div>
    `;this.open(f),this.overlayEl.querySelector("#modal-cancel-btn").addEventListener("click",()=>this.close());const w=this.overlayEl.querySelector("#ex-name-input");w.focus(),this.overlayEl.querySelector("#modal-save-ex-btn").addEventListener("click",()=>{const c=w.value.trim();if(!c)return;const g=parseInt(this.overlayEl.querySelector("#ex-sets-input").value)||3,h=parseInt(this.overlayEl.querySelector("#ex-reps-input").value)||10,v=parseFloat(this.overlayEl.querySelector("#ex-weight-input").value)||0,S=parseInt(this.overlayEl.querySelector("#ex-rest-input").value)||90,k=this.overlayEl.querySelector("#ex-unit-input").value||r,T=p.getRoutines().find(b=>b.id===t);T&&(n?T.exercises=T.exercises.map(b=>b.id===e.id?{...b,name:c,targetSets:g,targetReps:h,targetWeight:v,restTimeSec:S,unit:k}:b):T.exercises.push({id:"ex_"+Date.now(),name:c,targetSets:g,targetReps:h,targetWeight:v,restTimeSec:S,unit:k}),p.updateRoutine(T),o&&o(),this.close())})}}const z=new j,L={ROUTINES:"replog_routines_v1",HISTORY:"replog_history_v1",SETTINGS:"replog_settings_v1",ACTIVE_WORKOUT:"replog_active_workout_v1"};class V{constructor(){this.listeners=new Set,this.state={routines:[],history:[],settings:{...N},activeWorkout:null,activeTab:"today"},this.init()}init(){const t=localStorage.getItem(L.ROUTINES);if(t)try{this.state.routines=JSON.parse(t)}catch(l){console.error("Error parsing routines from storage, using defaults:",l),this.state.routines=JSON.parse(JSON.stringify(A))}else this.state.routines=JSON.parse(JSON.stringify(A)),this.saveRoutines();const e=localStorage.getItem(L.HISTORY);if(e)try{this.state.history=JSON.parse(e)}catch{this.state.history=[]}const o=localStorage.getItem(L.SETTINGS);if(o)try{this.state.settings={...N,...JSON.parse(o)}}catch{this.state.settings={...N}}const n=localStorage.getItem(L.ACTIVE_WORKOUT);if(n)try{this.state.activeWorkout=JSON.parse(n)}catch{this.state.activeWorkout=null}}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}setActiveTab(t){this.state.activeTab!==t&&(this.state.activeTab=t,this.notify())}saveRoutines(){localStorage.setItem(L.ROUTINES,JSON.stringify(this.state.routines))}getRoutines(){return this.state.routines}addRoutine(t){this.state.routines.push(t),this.saveRoutines(),this.notify()}updateRoutine(t){const e=this.state.routines.findIndex(o=>o.id===t.id);e!==-1&&(this.state.routines[e]=t,this.saveRoutines(),this.notify())}deleteRoutine(t){this.state.routines=this.state.routines.filter(e=>e.id!==t),this.saveRoutines(),this.notify()}startWorkout(t){const e=this.state.routines.find(n=>n.id===t);if(!e)return;if(!e.exercises||e.exercises.length===0){alert(`Cannot start workout: "${e.name}" has no exercises yet. Please add exercises first!`),this.setActiveTab("routines"),setTimeout(()=>{z.showExerciseModal(e.id)},80);return}const o=e.exercises.map(n=>{const l=[];for(let r=0;r<(n.targetSets||3);r++)l.push({setNumber:r+1,weight:n.targetWeight||50,reps:n.targetReps||10,completed:!1});return{...n,sets:l}});this.state.activeWorkout={id:"workout_"+Date.now(),routineId:e.id,routineName:e.name,startTime:Date.now(),exercises:o},localStorage.setItem(L.ACTIVE_WORKOUT,JSON.stringify(this.state.activeWorkout)),this.notify()}updateSetProgress(t,e,o){if(!this.state.activeWorkout)return;const n=this.state.activeWorkout.exercises.find(l=>l.id===t);n&&n.sets[e]&&(n.sets[e]={...n.sets[e],...o},localStorage.setItem(L.ACTIVE_WORKOUT,JSON.stringify(this.state.activeWorkout)),this.notify())}toggleSetComplete(t,e){if(!this.state.activeWorkout)return null;const o=this.state.activeWorkout.exercises.find(n=>n.id===t);if(o&&o.sets[e]){const n=o.sets[e].completed;if(o.sets[e].completed=!n,localStorage.setItem(L.ACTIVE_WORKOUT,JSON.stringify(this.state.activeWorkout)),this.notify(),!n)return{exerciseName:o.name,restTimeSec:o.restTimeSec||this.state.settings.defaultRestTimeSec||90}}return null}finishActiveWorkout(){if(!this.state.activeWorkout)return;const t=Date.now(),e=Math.round((t-this.state.activeWorkout.startTime)/1e3);let o=0,n=0;const l=[];this.state.activeWorkout.exercises.forEach(y=>{let u=0,x=0;const i=[];y.sets.forEach(a=>{if(a.completed){x++,n++;const d=(a.weight||0)*(a.reps||0);u+=d,o+=d,i.push({setNumber:a.setNumber,weight:a.weight,reps:a.reps})}}),x>0&&l.push({id:y.id,name:y.name,setsPerformed:x,volume:u,sets:i})});const r={id:"hist_"+Date.now(),routineId:this.state.activeWorkout.routineId,routineName:this.state.activeWorkout.routineName,date:Date.now(),durationSec:e,totalVolume:o,totalCompletedSets:n,exercises:l};return this.state.history.unshift(r),localStorage.setItem(L.HISTORY,JSON.stringify(this.state.history)),this.state.activeWorkout=null,localStorage.removeItem(L.ACTIVE_WORKOUT),this.notify(),r}cancelActiveWorkout(){this.state.activeWorkout=null,localStorage.removeItem(L.ACTIVE_WORKOUT),this.notify()}getHistory(){return this.state.history}deleteHistoryItem(t){this.state.history=this.state.history.filter(e=>e.id!==t),localStorage.setItem(L.HISTORY,JSON.stringify(this.state.history)),this.notify()}clearHistory(){this.state.history=[],localStorage.setItem(L.HISTORY,JSON.stringify(this.state.history)),this.notify()}getSettings(){return this.state.settings}updateSettings(t){this.state.settings={...this.state.settings,...t},localStorage.setItem(L.SETTINGS,JSON.stringify(this.state.settings)),this.notify()}exportDataJSON(){const t={version:"1.0",exportDate:new Date().toISOString(),routines:this.state.routines,history:this.state.history,settings:this.state.settings};return JSON.stringify(t,null,2)}importDataJSON(t){try{const e=JSON.parse(t);return e.routines&&Array.isArray(e.routines)&&(this.state.routines=e.routines,this.saveRoutines()),e.history&&Array.isArray(e.history)&&(this.state.history=e.history,localStorage.setItem(L.HISTORY,JSON.stringify(this.state.history))),e.settings&&(this.state.settings={...N,...e.settings},localStorage.setItem(L.SETTINGS,JSON.stringify(this.state.settings))),this.notify(),{success:!0}}catch(e){return{success:!1,error:e.message}}}resetToDefaultData(){this.state.routines=JSON.parse(JSON.stringify(A)),this.state.settings={...N},this.saveRoutines(),localStorage.setItem(L.SETTINGS,JSON.stringify(this.state.settings)),this.notify()}playChime(){if(this.state.settings.soundEnabled)try{const t=new(window.AudioContext||window.webkitAudioContext),e=t.createOscillator(),o=t.createGain();e.type="sine",e.frequency.setValueAtTime(587.33,t.currentTime),e.frequency.exponentialRampToValueAtTime(880,t.currentTime+.15),o.gain.setValueAtTime(.4,t.currentTime),o.gain.exponentialRampToValueAtTime(.001,t.currentTime+.8),e.connect(o),o.connect(t.destination),e.start(),e.stop(t.currentTime+.8)}catch(t){console.warn("Web Audio API not allowed or supported:",t)}}}const p=new V;function J(s){const t=document.createElement("nav");return t.className="navbar",[{id:"today",label:"Workout",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
             </svg>`},{id:"routines",label:"Routines",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
             </svg>`},{id:"history",label:"History",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>`},{id:"settings",label:"Settings",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
               <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>`}].forEach(o=>{const n=document.createElement("button");n.className=`nav-item ${s===o.id?"active":""}`,n.innerHTML=`${o.icon}<span>${o.label}</span>`,n.addEventListener("click",()=>{p.setActiveTab(o.id)}),t.appendChild(n)}),t}class Y{constructor(){this.interval=null,this.remainingSec=0,this.totalSec=0,this.exerciseName="",this.widgetEl=null,this.timeTextEl=null,this.titleEl=null}init(){this.widgetEl=document.createElement("div"),this.widgetEl.className="rest-timer-widget",this.widgetEl.innerHTML=`
      <div class="rest-timer-info">
        <div class="timer-circle">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"></circle>
            <circle id="timer-ring-progress" cx="24" cy="24" r="20" fill="none" stroke="#00F5D4" stroke-width="4" stroke-dasharray="125.6" stroke-dashoffset="0" transform="rotate(-90 24 24)"></circle>
          </svg>
        </div>
        <div>
          <div id="timer-exercise-name" style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Rest Timer</div>
          <div id="timer-time-display" class="timer-time-text">01:30</div>
        </div>
      </div>
      <div class="rest-timer-controls">
        <button class="timer-quick-btn" id="timer-minus-15">-15s</button>
        <button class="timer-quick-btn" id="timer-plus-15">+15s</button>
        <button class="timer-close-btn" id="timer-skip-btn">Skip</button>
      </div>
    `,document.body.appendChild(this.widgetEl),this.timeTextEl=this.widgetEl.querySelector("#timer-time-display"),this.titleEl=this.widgetEl.querySelector("#timer-exercise-name"),this.widgetEl.querySelector("#timer-minus-15").addEventListener("click",()=>this.adjustTime(-15)),this.widgetEl.querySelector("#timer-plus-15").addEventListener("click",()=>this.adjustTime(15)),this.widgetEl.querySelector("#timer-skip-btn").addEventListener("click",()=>this.stop())}start(t,e="Rest Time"){this.widgetEl||this.init(),this.totalSec=Math.max(5,t),this.remainingSec=this.totalSec,this.exerciseName=e,this.titleEl.textContent=`Rest after ${e}`,this.updateUI(),this.widgetEl.classList.add("visible"),this.interval&&clearInterval(this.interval),this.interval=setInterval(()=>{this.remainingSec--,this.remainingSec<=0?(this.remainingSec=0,this.updateUI(),clearInterval(this.interval),this.interval=null,p.playChime(),this.titleEl.textContent="REST TIME UP!",this.timeTextEl.style.color="#FF3366",setTimeout(()=>{this.stop()},3e3)):this.updateUI()},1e3)}adjustTime(t){this.remainingSec=Math.max(0,this.remainingSec+t),this.totalSec=Math.max(this.totalSec,this.remainingSec),this.updateUI()}updateUI(){if(!this.timeTextEl)return;const t=Math.floor(this.remainingSec/60),e=this.remainingSec%60;this.timeTextEl.textContent=`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`,this.timeTextEl.style.color="var(--accent-cyan)";const o=this.widgetEl.querySelector("#timer-ring-progress");if(o&&this.totalSec>0){const l=125.6*(1-this.remainingSec/this.totalSec);o.style.strokeDashoffset=l}}stop(){this.interval&&(clearInterval(this.interval),this.interval=null),this.widgetEl&&this.widgetEl.classList.remove("visible")}}const W=new Y;function P(){const s=document.createElement("div");s.className="view-container";const{activeWorkout:t,routines:e,settings:o}=p.state,n=o.unit||"kg";if(t){const l=Math.round((Date.now()-t.startTime)/1e3),r=d=>{const f=Math.floor(d/60),w=d%60;return`${String(f).padStart(2,"0")}:${String(w).padStart(2,"0")}`};let y=0,u=0;t.exercises.forEach(d=>{d.sets.forEach(f=>{u++,f.completed&&y++})}),s.innerHTML=`
      <!-- Active Workout Header Bar -->
      <div class="card" style="background: linear-gradient(145deg, #161920 0%, #1D2330 100%); border: 1px solid var(--border-glow); padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan); animation: pulsePR 1.5s infinite;"></span>
              <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em;">LIVE WORKOUT</span>
            </div>
            <h1 style="font-size: 22px; color: var(--text-primary); margin-top: 4px;">${t.routineName}</h1>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">ELAPSED TIME</div>
            <div class="mono" style="font-size: 20px; font-weight: 800; color: var(--text-primary);" id="live-workout-timer">${r(l)}</div>
          </div>
        </div>

        <div style="margin-top: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; height: 8px; overflow: hidden; position: relative;">
          <div style="background: var(--accent-purple-gradient); height: 100%; width: ${u?Math.round(y/u*100):0}%; transition: width 0.3s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-top: 6px; font-weight: 600;">
          <span>Completed: <strong style="color: var(--accent-cyan);">${y}</strong> / ${u} sets</span>
          <span>${u?Math.round(y/u*100):0}% Done</span>
        </div>
      </div>

      <!-- Exercise Cards -->
      <div id="active-exercises-list" style="display: flex; flex-direction: column; gap: 16px;"></div>

      <!-- Footer Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
        <button class="btn btn-primary btn-full" id="finish-workout-btn" style="padding: 16px; font-size: 16px; background: var(--accent-cyan); color: #0A0C0F; font-weight: 800;">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Finish & Save Workout
        </button>
        <button class="btn btn-secondary btn-full" id="cancel-workout-btn" style="color: var(--accent-coral); border-color: rgba(255, 51, 102, 0.3);">
          Discard Workout
        </button>
      </div>
    `;const x=s.querySelector("#live-workout-timer"),i=setInterval(()=>{if(!document.body.contains(x)||!p.state.activeWorkout){clearInterval(i);return}const d=Math.round((Date.now()-p.state.activeWorkout.startTime)/1e3);x&&(x.textContent=r(d))},1e3),a=s.querySelector("#active-exercises-list");t.exercises.forEach(d=>{const f=d.unit||n,w=document.createElement("div");w.className="exercise-card",w.innerHTML=`
        <div class="exercise-title-row">
          <div class="exercise-title">
            <span>${d.name}</span>
          </div>
        </div>

        <!-- Table header labels -->
        <div style="display: grid; grid-template-columns: 32px 1fr 1fr 38px; gap: 5px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; padding: 0 4px;">
          <span style="text-align: center;">Set</span>
          <span style="text-align: center;">Weight (${f.toUpperCase()})</span>
          <span style="text-align: center;">Reps</span>
          <span style="text-align: center;">Done</span>
        </div>

        <div class="sets-table">
          ${d.sets.map((c,g)=>`
            <div class="set-row ${c.completed?"completed":""}" data-set-index="${g}">
              <div class="set-number">${c.setNumber}</div>
              
              <!-- Weight Stepper -->
              <div class="stepper-group">
                <button class="stepper-btn weight-minus-btn" type="button" title="Decrease weight">-</button>
                <input type="number" step="any" inputmode="decimal" class="stepper-input weight-input" value="${c.weight}" title="Tap to enter weight manually">
                <button class="stepper-btn weight-plus-btn" type="button" title="Increase weight">+</button>
              </div>

              <!-- Reps Stepper -->
              <div class="stepper-group">
                <button class="stepper-btn reps-minus-btn" type="button" title="Decrease reps">-</button>
                <input type="number" step="1" inputmode="numeric" class="stepper-input reps-input" value="${c.reps}" title="Tap to enter reps manually">
                <button class="stepper-btn reps-plus-btn" type="button" title="Increase reps">+</button>
              </div>

              <!-- Set Checkbox Button -->
              <button class="set-check-btn" type="button" title="Mark set completed">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
            </div>
          `).join("")}
        </div>

        <button class="btn btn-secondary add-extra-set-btn" style="padding: 8px; font-size: 13px; margin-top: 4px;" type="button">
          + Add Extra Set
        </button>
      `,d.sets.forEach((c,g)=>{const h=w.querySelector(`.set-row[data-set-index="${g}"]`),v=h.querySelector(".weight-input"),S=h.querySelector(".reps-input");h.querySelector(".weight-minus-btn").addEventListener("click",()=>{p.updateSetProgress(d.id,g,{weight:Math.max(0,c.weight-2.5)})}),h.querySelector(".weight-plus-btn").addEventListener("click",()=>{p.updateSetProgress(d.id,g,{weight:c.weight+2.5})});const k=()=>{const b=parseFloat(v.value);!isNaN(b)&&b!==c.weight&&p.updateSetProgress(d.id,g,{weight:Math.max(0,b)})};v.addEventListener("change",k),v.addEventListener("blur",k),h.querySelector(".reps-minus-btn").addEventListener("click",()=>{p.updateSetProgress(d.id,g,{reps:Math.max(1,c.reps-1)})}),h.querySelector(".reps-plus-btn").addEventListener("click",()=>{p.updateSetProgress(d.id,g,{reps:c.reps+1})});const T=()=>{const b=parseInt(S.value,10);!isNaN(b)&&b!==c.reps&&p.updateSetProgress(d.id,g,{reps:Math.max(1,b)})};S.addEventListener("change",T),S.addEventListener("blur",T),h.querySelector(".set-check-btn").addEventListener("click",()=>{const b=p.toggleSetComplete(d.id,g);b&&W.start(b.restTimeSec,b.exerciseName)})}),w.querySelector(".add-extra-set-btn").addEventListener("click",()=>{const c=d.sets[d.sets.length-1]||{weight:50,reps:10};d.sets.push({setNumber:d.sets.length+1,weight:c.weight,reps:c.reps,completed:!1}),p.notify()}),a.appendChild(w)}),s.querySelector("#finish-workout-btn").addEventListener("click",()=>{confirm("Great job! Finish and save this workout to your history?")&&(W.stop(),p.finishActiveWorkout(),p.setActiveTab("history"))}),s.querySelector("#cancel-workout-btn").addEventListener("click",()=>{confirm("Are you sure you want to discard this workout without saving?")&&(W.stop(),p.cancelActiveWorkout())})}else{s.innerHTML=`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
        <div>
          <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.08em;">RepLog</span>
          <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Start Workout</h1>
        </div>
        
      </div>

      <p style="color: var(--text-secondary); font-size: 14px;">Select your planned routine for today to begin logging sets, weights, and rest times.</p>

      <!-- Routine Selection Pills -->
      <div class="pill-selector" id="routine-pills"></div>

      <!-- Preview Selected Routine Card -->
      <div id="selected-routine-preview" style="display: flex; flex-direction: column; gap: 16px;"></div>
    `;const l=s.querySelector("#routine-pills"),r=s.querySelector("#selected-routine-preview");if(e.length===0){r.innerHTML=`
        <div class="empty-state card">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p>No routines created yet.</p>
          <button class="btn btn-primary" id="goto-routines-btn">Go to Routines Planner</button>
        </div>
      `;const x=r.querySelector("#goto-routines-btn");return x&&x.addEventListener("click",()=>p.setActiveTab("routines")),s}let y=e[0].id;const u=x=>{const i=e.find(d=>d.id===x);if(!i)return;l.querySelectorAll(".pill-btn").forEach(d=>{d.dataset.id===i.id?d.classList.add("active"):d.classList.remove("active")});const a=i.exercises.length;if(i.exercises.reduce((d,f)=>d+(f.targetSets||3),0),a===0){r.innerHTML=`
          <div class="card card-glass" style="border-color: rgba(255, 183, 3, 0.4);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="exercise-meta-badge" style="background: rgba(255, 183, 3, 0.15); color: #FFB703;">0 Exercises • Empty Routine</span>
                <h2 style="font-size: 22px; margin-top: 8px;">${i.name}</h2>
              </div>
            </div>

            <div style="background: rgba(255, 183, 3, 0.12); border: 1px dashed rgba(255, 183, 3, 0.5); padding: 16px; border-radius: 10px; color: #FFB703; font-size: 14px; margin: 16px 0; text-align: center;">
              <svg style="margin: 0 auto 8px auto; display: block;" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <strong>Cannot Start Workout Yet</strong>
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">Please add at least one exercise to "${i.name}" before starting your workout.</p>
            </div>

            <button class="btn btn-primary btn-full" id="redirect-add-ex-btn" style="padding: 16px; font-size: 16px; background: var(--accent-cyan); color: #0A0C0F;">
              + Add Exercises to "${i.name}"
            </button>
          </div>
        `,r.querySelector("#redirect-add-ex-btn").addEventListener("click",()=>{p.setActiveTab("routines"),setTimeout(()=>{z.showExerciseModal(i.id)},80)});return}r.innerHTML=`
        <div class="card card-glass" style="border-color: rgba(0, 245, 212, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              
              <h2 style="font-size: 22px; margin-top: 8px;">${i.name}</h2>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
            ${i.exercises.map(d=>`
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-surface-2); border-radius: 8px; font-size: 14px;">
                <span style="font-weight: 600; color: var(--text-primary);">${d.name}</span>
                <span class="mono" style="color: var(--text-secondary); font-size: 13px;">${d.targetSets} × ${d.targetReps} @ ${d.targetWeight} ${(d.unit||n).toUpperCase()}</span>
              </div>
            `).join("")}
          </div>

          <button class="btn btn-primary btn-full" id="start-btn" style="padding: 16px; font-size: 16px; margin-top: 8px;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            Start Today's Workout
          </button>
        </div>
      `,r.querySelector("#start-btn").addEventListener("click",()=>{if(i.exercises.length===0){p.setActiveTab("routines"),setTimeout(()=>{z.showExerciseModal(i.id)},80);return}p.startWorkout(i.id)})};e.forEach(x=>{const i=document.createElement("button");i.className="pill-btn",i.textContent=x.name,i.dataset.id=x.id,i.addEventListener("click",()=>{y=x.id,u(y)}),l.appendChild(i)}),u(y)}return s}function _(){const s=document.createElement("div");s.className="view-container";const{routines:t,settings:e}=p.state,o=e.unit||"kg";s.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
      <div>
        <span style="font-size: 12px; font-weight: 700; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 0.08em;">Plan & Templates</span>
        <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Routines</h1>
      </div>
      <button class="btn btn-primary" id="create-routine-btn" style="padding: 10px 16px; font-size: 14px;">
        + New Routine
      </button>
    </div>

    <p style="color: var(--text-secondary); font-size: 14px;">
      Manage your workout days and exercises.
    </p>

    <div id="routines-list" style="display: flex; flex-direction: column; gap: 20px; margin-top: 8px;"></div>
  `,s.querySelector("#create-routine-btn").addEventListener("click",()=>{z.showAddRoutineModal()});const n=s.querySelector("#routines-list");if(t.length===0){n.innerHTML=`
      <div class="empty-state card">
        
        <p>You haven't created any routines yet.</p>
        <button class="btn btn-secondary" id="empty-add-btn">+ Create First Routine</button>
      </div>
    `;const r=n.querySelector("#empty-add-btn");return r&&r.addEventListener("click",()=>z.showAddRoutineModal()),s}const l=(r,y,u,x)=>{let i=!1,a=null;const d=g=>{g.preventDefault(),i=!0,y.classList.add("holding"),r.classList.add("dragging-item")},f=g=>{a=setTimeout(()=>{d(g)},150)},w=g=>{if(!i)return;g.preventDefault();const h=g.touches?g.touches[0].clientY:g.clientY,v=r.parentNode,S=Array.from(v.children).filter(k=>k!==r&&k.style.display!=="none");for(let k of S){const T=k.getBoundingClientRect(),b=T.top+T.height/2;if(h<b&&r.nextElementSibling!==k){if(k.getBoundingClientRect().top<r.getBoundingClientRect().top){v.insertBefore(r,k);break}}else if(h>b&&r.previousElementSibling!==k&&k.getBoundingClientRect().top>r.getBoundingClientRect().top){v.insertBefore(k,r);break}}},c=()=>{if(a&&clearTimeout(a),!i)return;i=!1,y.classList.remove("holding"),r.classList.remove("dragging-item");const g=r.parentNode,h=Array.from(g.children).map(k=>k.dataset.itemId).filter(Boolean),v=u(),S=[];h.forEach(k=>{const T=v.find(b=>b.id===k);T&&S.push(T)}),S.length===v.length&&x(S)};y.addEventListener("touchstart",f,{passive:!1}),y.addEventListener("mousedown",f),window.addEventListener("touchmove",w,{passive:!1}),window.addEventListener("mousemove",w),window.addEventListener("touchend",c),window.addEventListener("touchcancel",c),window.addEventListener("mouseup",c)};return t.forEach(r=>{const y=document.createElement("div");y.className="card",y.dataset.itemId=r.id,y.style.display="flex",y.style.flexDirection="column",y.style.gap="14px",y.style.borderLeft="4px solid var(--accent-cyan)",y.innerHTML=`
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
          <!-- Routine Reorder Touch & Hold Handle -->
          <div class="reorder-handle routine-reorder-handle" title="Touch & hold to reorder routines">⋮⋮</div>
          <div style="flex: 1; max-width: 260px;">
            <input type="text" class="routine-name-input" value="${r.name}" title="Click or select to rename routine" spellcheck="false" autocomplete="off" />
            <span style="font-size: 12px; color: var(--text-muted); font-weight: 600; display: block; margin-top: 2px;">${r.exercises.length} Exercises Planned</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary add-ex-btn" type="button" style="padding: 8px 12px; font-size: 13px; border-color: var(--accent-cyan); color: var(--accent-cyan);">
            + Add Exercise
          </button>
          <button class="stepper-btn delete-routine-btn" type="button" style="color: var(--accent-coral); background: rgba(255, 51, 102, 0.1);" title="Delete Routine Day">
            ✕
          </button>
        </div>
      </div>

      <!-- Exercise List for this Routine -->
      <div class="routine-exercises-sublist" style="display: flex; flex-direction: column; gap: 8px;">
        ${r.exercises.length===0?`
          <div style="text-align: center; padding: 20px; background: var(--bg-surface-2); border-radius: 10px; color: var(--text-muted); font-size: 13px;">
            No exercises added yet. Click "+ Add Exercise" above!
          </div>
        `:""}

        ${r.exercises.map(i=>{const a=i.unit||o;return`
            <div class="exercise-item-row" data-item-id="${i.id}" data-ex-id="${i.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--bg-surface-2); border-radius: 10px; border: 1px solid var(--border-subtle); cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <!-- Exercise Touch & Hold Reorder Handle -->
                <div class="reorder-handle ex-reorder-handle" title="Touch & hold to reorder exercise">⋮⋮</div>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${i.name}</span>
                  <span class="mono" style="font-size: 13px; color: var(--accent-cyan);">
                    ${i.targetSets||4} sets × ${i.targetReps||10} reps @ ${i.targetWeight||50} ${a.toUpperCase()}
                  </span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; background: var(--bg-surface-3); color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-weight: 600;">
                  Rest: ${i.restTimeSec||90}s
                </span>
                <!-- Delete Exercise button -->
                <button class="stepper-btn delete-ex-btn" type="button" style="width: 28px; height: 28px; color: var(--accent-coral);" title="Remove exercise">🗑️</button>
              </div>
            </div>
          `}).join("")}
      </div>
    `;const u=y.querySelector(".routine-name-input");u&&(u.addEventListener("change",i=>{const a=i.target.value.trim();a&&a!==r.name?p.updateRoutine({...r,name:a}):a||(i.target.value=r.name)}),u.addEventListener("keydown",i=>{i.key==="Enter"&&u.blur()}),u.addEventListener("click",i=>i.stopPropagation()));const x=y.querySelector(".routine-reorder-handle");x&&l(y,x,()=>p.getRoutines(),i=>{p.saveRoutines(i)}),y.querySelector(".add-ex-btn").addEventListener("click",()=>{z.showExerciseModal(r.id)}),y.querySelector(".delete-routine-btn").addEventListener("click",()=>{confirm(`Delete routine "${r.name}"?`)&&p.deleteRoutine(r.id)}),r.exercises.forEach(i=>{const a=y.querySelector(`.exercise-item-row[data-ex-id="${i.id}"]`);if(!a)return;a.addEventListener("click",f=>{f.target.closest("button")||f.target.closest(".reorder-handle")||z.showExerciseModal(r.id,i)});const d=a.querySelector(".ex-reorder-handle");d&&l(a,d,()=>r.exercises,f=>{p.updateRoutine({...r,exercises:f})}),a.querySelector(".delete-ex-btn").addEventListener("click",f=>{f.stopPropagation();const w=r.exercises.filter(c=>c.id!==i.id);p.updateRoutine({...r,exercises:w})})}),n.appendChild(y)}),s}let R="day",M=new Date,D=new Date,O=new Date,I=new Date;function $(){const s=document.createElement("div");s.className="view-container";const{history:t,settings:e}=p.state,o=e.unit||"kg",n=t.length,l=t.reduce((i,a)=>i+(a.totalVolume||0),0),r=t.reduce((i,a)=>i+(a.totalCompletedSets||0),0);s.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
      <div>
        <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.08em;">Progress & Calendar</span>
        <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Workout History</h1>
      </div>
      ${n>0?`
        <button class="stepper-btn" id="clear-all-history-btn" style="color: var(--accent-coral); font-size: 13px; width: auto; padding: 6px 12px; background: rgba(255, 51, 102, 0.1);">
          Clear All
        </button>
      `:""}
    </div>

    <!-- Stats & Calendar Sub-Navbar Tabs -->
    <div style="display: flex; gap: 6px; background: var(--bg-surface-2); padding: 5px; border-radius: 12px; margin-top: 12px; border: 1px solid var(--border-subtle);">
      <button class="period-tab-btn ${R==="day"?"active":""}" data-period="day">Day</button>
      <button class="period-tab-btn ${R==="month"?"active":""}" data-period="month">Month</button>
      <button class="period-tab-btn ${R==="year"?"active":""}" data-period="year">Year</button>
    </div>

    <div id="stats-tab-content" style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px;"></div>
  `;const y=s.querySelector("#clear-all-history-btn");y&&y.addEventListener("click",()=>{confirm("Are you sure you want to permanently delete all workout history?")&&p.clearHistory()}),s.querySelectorAll(".period-tab-btn").forEach(i=>{i.addEventListener("click",()=>{R=i.dataset.period;const a=s.parentNode;a&&a.replaceChild($(),s)})});const u=s.querySelector("#stats-tab-content");if(R==="day"){const i=M.getFullYear(),a=M.getMonth(),f=["January","February","March","April","May","June","July","August","September","October","November","December"][a],w=new Date(i,a,1).getDay(),c=new Date(i,a+1,0).getDate(),g=new Set;t.forEach(m=>{const E=new Date(m.date);E.getFullYear()===i&&E.getMonth()===a&&g.add(E.getDate())});const h=t.filter(m=>new Date(m.date).toDateString()===D.toDateString()),v=h.reduce((m,E)=>m+(E.totalVolume||0),0),S=h.reduce((m,E)=>m+(E.totalCompletedSets||0),0),k=h.reduce((m,E)=>m+(E.exercises?E.exercises.length:0),0),T=D.toDateString()===new Date().toDateString();let b="";for(let m=0;m<w;m++)b+='<div class="calendar-cell empty"></div>';for(let m=1;m<=c;m++){const E=new Date(i,a,m),C=g.has(m),H=E.toDateString()===D.toDateString(),U=E.toDateString()===new Date().toDateString();b+=`
        <div class="calendar-cell ${C?"has-workout":""} ${H?"selected-day":""}" data-day="${m}" title="${E.toLocaleDateString()}: ${C?"Workouts completed!":"No workout"}">
          <span>${m}</span>
          ${C?'<span style="font-size: 8px; margin-top: -2px;">●</span>':""}
          ${U&&!C?'<span style="font-size: 8px; color: var(--accent-cyan); margin-top: -2px;">•</span>':""}
        </div>
      `}u.innerHTML=`
      <!-- Calendar Card -->
      <div class="card" style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="stepper-btn" id="cal-prev-btn" style="width: 32px; height: 32px; font-size: 14px;">◀</button>
          <div style="display: flex; align-items: center; gap: 30px;">
            <h2 style="font-size: 18px; color: var(--text-primary); margin: 0;">${f} ${i}</h2>
            <button class="btn btn-secondary" id="cal-today-btn" style="padding: 4px 10px; font-size: 11px; border-radius: 6px;">Go to Today</button>
          </div>
          <button class="stepper-btn" id="cal-next-btn" style="width: 32px; height: 32px; font-size: 14px;">▶</button>
        </div>

        <div class="calendar-grid" style="margin-top: 14px;">
          <div class="calendar-day-header">Sun</div>
          <div class="calendar-day-header">Mon</div>
          <div class="calendar-day-header">Tue</div>
          <div class="calendar-day-header">Wed</div>
          <div class="calendar-day-header">Thu</div>
          <div class="calendar-day-header">Fri</div>
          <div class="calendar-day-header">Sat</div>
          ${b}
        </div>
        
      </div>

      <!-- Summarized Day Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #13161C 0%, #1A2230 100%); border-color: rgba(0, 245, 212, 0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 14px; font-weight: 700; color: var(--text-primary);">
            ${T?"Today (":""}${D.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}${T?")":""}
          </span>
          <span class="exercise-meta-badge" style="background: rgba(0, 245, 212, 0.15); color: var(--accent-cyan);">
            ${h.length} Session${h.length===1?"":"s"}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL VOLUME</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: var(--accent-cyan); margin-top: 2px;">
              ${v>=1e4?(v/1e3).toFixed(1)+"k":v.toLocaleString()} ${o.toUpperCase()}
            </div>
          </div>
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL SETS</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">
              ${S}
            </div>
          </div>
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">EXERCISES PLAYED</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: #7B2CBF; margin-top: 2px;">
              ${k}
            </div>
          </div>
        </div>
      </div>

      <!-- What exercise played on what day list -->
      <div>
        
        ${h.length===0?`
          <div class="card empty-state" style="padding: 24px; text-align: center;">
            <p style="color: var(--text-muted); font-size: 13px;">No workouts recorded on ${D.toLocaleDateString()}. Tap on any highlighted date above to inspect completed sessions!</p>
          </div>
        `:""}
        <div id="day-workouts-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>
    `,u.querySelector("#cal-prev-btn").addEventListener("click",()=>{M=new Date(i,a-1,1);const m=s.parentNode;m&&m.replaceChild($(),s)}),u.querySelector("#cal-next-btn").addEventListener("click",()=>{M=new Date(i,a+1,1);const m=s.parentNode;m&&m.replaceChild($(),s)}),u.querySelector("#cal-today-btn").addEventListener("click",()=>{const m=new Date;M=new Date(m.getFullYear(),m.getMonth(),1),D=new Date(m.getFullYear(),m.getMonth(),m.getDate());const E=s.parentNode;E&&E.replaceChild($(),s)}),u.querySelectorAll(".calendar-cell[data-day]").forEach(m=>{m.addEventListener("click",()=>{const E=parseInt(m.dataset.day);D=new Date(i,a,E);const C=s.parentNode;C&&C.replaceChild($(),s)})});const B=u.querySelector("#day-workouts-list");return B&&h.forEach(m=>{B.appendChild(q(m,o))}),s}if(R==="month"){const i=O.getFullYear(),a=O.getMonth(),d=["January","February","March","April","May","June","July","August","September","October","November","December"],f=t.filter(v=>{const S=new Date(v.date);return S.getFullYear()===i&&S.getMonth()===a}),w=f.reduce((v,S)=>v+(S.totalVolume||0),0),c=f.reduce((v,S)=>v+(S.totalCompletedSets||0),0),g=new Set;f.forEach(v=>g.add(new Date(v.date).getDate())),u.innerHTML=`
      <!-- Month Selector Card -->
      <div class="card" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
        <button class="stepper-btn" id="m-prev-btn" style="width: 32px; height: 32px;">◀</button>
        <h2 style="font-size: 20px; color: var(--text-primary); margin: 0;">${d[a]} ${i}</h2>
        <button class="stepper-btn" id="m-next-btn" style="width: 32px; height: 32px;">▶</button>
      </div>

      <!-- Summarized Month Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #13161C 0%, #1F2838 100%); border-color: rgba(0, 245, 212, 0.3);">
        <h3 style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Monthly Performance Summary
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 700;">WORKOUT SESSIONS</div>
            <div class="mono" style="font-size: 24px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${f.length}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${g.size} unique active days</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 700;">TOTAL VOLUME</div>
            <div class="mono" style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${w>=1e4?(w/1e3).toFixed(1)+"k":w.toLocaleString()} ${o.toUpperCase()}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Across ${c} total sets</div>
          </div>
        </div>
      </div>

      <!-- Workouts list for this month -->
      <div>
        <h3 style="font-size: 16px; color: var(--text-secondary); margin-bottom: 10px;">${d[a]} Logs (${f.length})</h3>
        ${f.length===0?`
          <div class="card empty-state" style="padding: 24px; text-align: center; color: var(--text-muted);">No workouts logged during ${d[a]} ${i}.</div>
        `:""}
        <div id="month-workouts-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>
    `,u.querySelector("#m-prev-btn").addEventListener("click",()=>{O=new Date(i,a-1,1);const v=s.parentNode;v&&v.replaceChild($(),s)}),u.querySelector("#m-next-btn").addEventListener("click",()=>{O=new Date(i,a+1,1);const v=s.parentNode;v&&v.replaceChild($(),s)});const h=u.querySelector("#month-workouts-list");return h&&f.forEach(v=>{h.appendChild(q(v,o))}),s}if(R==="year"){const i=I.getFullYear(),a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],d=t.filter(c=>new Date(c.date).getFullYear()===i),f=d.reduce((c,g)=>c+(g.totalVolume||0),0);d.reduce((c,g)=>c+(g.totalCompletedSets||0),0);const w=new Set;return d.forEach(c=>w.add(new Date(c.date).getMonth())),u.innerHTML=`
      <!-- Year Selector Card -->
      <div class="card" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
        <button class="stepper-btn" id="y-prev-btn" style="width: 32px; height: 32px;">◀</button>
        <h2 style="font-size: 22px; color: var(--text-primary); margin: 0;">Year ${i}</h2>
        <button class="stepper-btn" id="y-next-btn" style="width: 32px; height: 32px;">▶</button>
      </div>

      <!-- Summarized Year Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #1A1326 0%, #13161C 100%); border-color: rgba(123, 44, 191, 0.4);">
        <h3 style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          🏆 Annual Overview (${i})
        </h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL WORKOUTS</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${d.length}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">ANNUAL VOLUME</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${f>=1e4?(f/1e3).toFixed(1)+"k":f.toLocaleString()}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">ACTIVE MONTHS</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: #7B2CBF; margin-top: 4px;">${w.size} / 12</div>
          </div>
        </div>
      </div>

      <!-- Monthly Breakdown Grid -->
      <div>
        <h3 style="font-size: 15px; color: var(--text-secondary); margin-bottom: 10px;">Monthly Breakdown</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          ${a.map((c,g)=>{const h=d.filter(S=>new Date(S.date).getMonth()===g),v=h.reduce((S,k)=>S+(k.totalVolume||0),0);return`
              <div class="card month-card-btn" data-month="${g}" style="padding: 12px; text-align: center; cursor: pointer; border-color: ${h.length>0?"var(--accent-cyan)":"var(--border-subtle)"}; background: ${h.length>0?"rgba(0, 245, 212, 0.05)":"var(--bg-surface-2)"}; transition: all 0.2s ease;">
                <div style="font-weight: 700; font-size: 14px; color: ${h.length>0?"var(--accent-cyan)":"var(--text-primary)"};">${c}</div>
                <div class="mono" style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${h.length} <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">workouts</span></div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${v?(v>=1e3?(v/1e3).toFixed(1)+"k":v)+" "+o:"0 "+o}</div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,u.querySelector("#y-prev-btn").addEventListener("click",()=>{I=new Date(i-1,0,1);const c=s.parentNode;c&&c.replaceChild($(),s)}),u.querySelector("#y-next-btn").addEventListener("click",()=>{I=new Date(i+1,0,1);const c=s.parentNode;c&&c.replaceChild($(),s)}),u.querySelectorAll(".month-card-btn").forEach(c=>{c.addEventListener("click",()=>{const g=parseInt(c.dataset.month);O=new Date(i,g,1),R="month";const h=s.parentNode;h&&h.replaceChild($(),s)})}),s}u.innerHTML=`
    <!-- Overall Stats Overview Card -->
    <div class="card" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: linear-gradient(135deg, #13161C 0%, #1A2230 100%); border-color: rgba(0, 245, 212, 0.2);">
      <div style="text-align: center;">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">ALL WORKOUTS</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${n}</div>
      </div>
      <div style="text-align: center; border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">TOTAL VOLUME</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${l>=1e4?(l/1e3).toFixed(1)+"k":l.toLocaleString()}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">TOTAL SETS</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: #7B2CBF; margin-top: 4px;">${r}</div>
      </div>
    </div>

    <div id="all-history-list" style="display: flex; flex-direction: column; gap: 14px; margin-top: 4px;"></div>
  `;const x=u.querySelector("#all-history-list");if(t.length===0){x.innerHTML=`
      <div class="empty-state card">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No workouts recorded yet. Head over to Workout and finish a session to see your logs here!</p>
        <button class="btn btn-primary" id="goto-workout-btn">Start Today's Workout</button>
      </div>
    `;const i=x.querySelector("#goto-workout-btn");i&&i.addEventListener("click",()=>p.setActiveTab("today"))}else t.forEach(i=>{x.appendChild(q(i,o))});return s}function q(s,t){const e=document.createElement("div");e.className="card",e.style.display="flex",e.style.flexDirection="column",e.style.gap="12px";const o=l=>new Date(l).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}),n=l=>`${Math.floor(l/60)} min`;return e.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <h2 style="font-size: 18px; color: var(--text-primary);">${s.routineName||"Custom Workout"}</h2>
        <span style="font-size: 12px; color: var(--text-muted);">${o(s.date)} • ⏱️ ${n(s.durationSec||0)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="text-align: right;">
          <div class="mono" style="font-size: 15px; font-weight: 800; color: var(--accent-cyan);">${s.totalVolume?s.totalVolume.toLocaleString():0} ${t.toUpperCase()}</div>
          <div style="font-size: 11px; color: var(--text-secondary);">${s.totalCompletedSets||0} sets</div>
        </div>
        <button class="stepper-btn delete-item-btn" type="button" style="color: var(--accent-coral);" title="Delete entry">✕</button>
      </div>
    </div>

    <!-- Expandable breakdown of exercises -->
    <div class="exercise-breakdown" style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
      ${(s.exercises||[]).map(l=>`
        <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-surface-2); padding: 8px 10px; border-radius: 8px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary);">
            <span>${l.name}</span>
            <span class="mono" style="color: var(--text-secondary); font-size: 12px;">${l.setsPerformed} sets • ${l.volume} ${(l.unit||t).toUpperCase()}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;">
            ${(l.sets||[]).map(r=>`
              <span class="mono" style="background: var(--bg-surface-3); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                #${r.setNumber}: ${r.weight}×${r.reps}
              </span>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `,e.querySelector(".delete-item-btn").addEventListener("click",()=>{confirm("Delete this workout history entry?")&&p.deleteHistoryItem(s.id)}),e}function G(){const s=document.createElement("div");s.className="view-container";const t=p.getSettings();return s.innerHTML=`
    <div style="margin-top: 4px;">
      <span style="font-size: 12px; font-weight: 700; color: #7B2CBF; text-transform: uppercase; letter-spacing: 0.08em;">Preferences & Backup</span>
      <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Settings</h1>
    </div>

    <!-- Unit & Audio Settings Card -->
    <div class="card" style="display: flex; flex-direction: column; gap: 18px;">
      <h2 style="font-size: 18px; color: var(--accent-cyan); border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">Workout Preferences</h2>

      <!-- Unit Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Weight Unit</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Choose your default weight measurement</div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="pill-btn ${t.unit==="kg"?"active":""}" id="unit-kg-btn" style="padding: 6px 14px; font-size: 13px;">KG</button>
          <button class="pill-btn ${t.unit==="lbs"?"active":""}" id="unit-lbs-btn" style="padding: 6px 14px; font-size: 13px;">LBS</button>
        </div>
      </div>

      <!-- Rest Timer Chime Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Audio Chime Alerts</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Play subtle beep when rest timer finishes</div>
        </div>
        <button class="pill-btn ${t.soundEnabled?"active":""}" id="sound-toggle-btn" style="padding: 6px 14px; font-size: 13px;">
          ${t.soundEnabled?"ON 🔊":"OFF 🔇"}
        </button>
      </div>

      <!-- Default Rest Time -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Default Rest Interval</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Used when adding new exercises</div>
        </div>
        <select id="default-rest-select" class="form-select" style="width: 140px; padding: 8px 12px;">
          <option value="60" ${t.defaultRestTimeSec===60?"selected":""}>60 sec</option>
          <option value="90" ${t.defaultRestTimeSec===90?"selected":""}>90 sec</option>
          <option value="120" ${t.defaultRestTimeSec===120?"selected":""}>120 sec</option>
          <option value="180" ${t.defaultRestTimeSec===180?"selected":""}>180 sec</option>
        </select>
      </div>
    </div>

    <!-- Data Backup & Restore Card -->
    <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
      <h2 style="font-size: 18px; color: var(--accent-cyan); border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">Offline Data Backup</h2>
      
      <p style="font-size: 13px; color: var(--text-secondary);">
        All RepLog data is stored securely offline on this mobile device. You can export your data as a JSON file anytime to transfer between devices or save a cloud backup!
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <button class="btn btn-secondary" id="export-json-btn" style="padding: 12px; font-size: 14px;">
          📥 Export Backup
        </button>
        <label class="btn btn-secondary" style="padding: 12px; font-size: 14px; cursor: pointer; text-align: center;">
          📤 Import Backup
          <input type="file" id="import-json-file" accept=".json" style="display: none;" />
        </label>
      </div>
    </div>

    <!-- Reset to Defaults Card -->
    <div class="card" style="display: flex; flex-direction: column; gap: 14px; border-color: rgba(255, 51, 102, 0.25);">
      
    <button class="btn" id="reset-defaults-btn" style="background: rgba(255, 51, 102, 0.15); color: var(--accent-coral); border: 1px solid var(--accent-coral); padding: 12px; font-size: 14px;">
    ⚠️ Reset to Default Routines
    </button>
    <p style="font-size: 13px; color: var(--text-secondary);">
      Resetting will restore the default starter routines (Push, Pull, Legs) and clear custom modifications.
    </p>
    </div>

    <!-- PWA About -->
    <div style="text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 12px;">
      RepLog PWA v1.0 • Built with Vanilla JS & Mobile-First Ergonomics
    </div>
  `,s.querySelector("#unit-kg-btn").addEventListener("click",()=>{p.updateSettings({unit:"kg"})}),s.querySelector("#unit-lbs-btn").addEventListener("click",()=>{p.updateSettings({unit:"lbs"})}),s.querySelector("#sound-toggle-btn").addEventListener("click",()=>{p.updateSettings({soundEnabled:!t.soundEnabled})}),s.querySelector("#default-rest-select").addEventListener("change",e=>{p.updateSettings({defaultRestTimeSec:parseInt(e.target.value)||90})}),s.querySelector("#export-json-btn").addEventListener("click",()=>{const e=p.exportDataJSON(),o=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(o),l=document.createElement("a");l.href=n,l.download=`RepLog-Backup-${new Date().toISOString().split("T")[0]}.json`,l.click(),URL.revokeObjectURL(n)}),s.querySelector("#import-json-file").addEventListener("change",e=>{const o=e.target.files[0];if(!o)return;const n=new FileReader;n.onload=l=>{const r=p.importDataJSON(l.target.result);r.success?alert("Data successfully imported and restored!"):alert("Failed to import file: "+r.error)},n.readAsText(o)}),s.querySelector("#reset-defaults-btn").addEventListener("click",()=>{confirm("Are you sure you want to reset all routines to the original Push / Pull / Legs starter templates?")&&p.resetToDefaultData()}),s}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(s=>{console.log("RepLog SW registered with scope:",s.scope)}).catch(s=>{console.error("RepLog SW registration failed:",s)})});function F(){const s=document.getElementById("app");if(!s)return;s.innerHTML="";const{activeTab:t}=p.state;let e;switch(t){case"today":e=P();break;case"routines":e=_();break;case"history":e=$();break;case"settings":e=G();break;default:e=P()}s.appendChild(e),s.appendChild(J(t))}p.subscribe(()=>{F()});window.addEventListener("DOMContentLoaded",()=>{F()});(document.readyState==="complete"||document.readyState==="interactive")&&F();
