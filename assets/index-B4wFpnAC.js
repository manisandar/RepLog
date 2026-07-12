(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const h of a.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&l(h)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const V=[{id:"push-day",name:"Push Day",exercises:[{id:"ex-bench-press",name:"Incline Barbell Bench Press",targetSets:4,targetReps:10,targetWeight:40,restTimeSec:90},{id:"ex-ohp",name:"Machine Chest Press",targetSets:4,targetReps:10,targetWeight:55,restTimeSec:90},{id:"ex-incline-db",name:"Incline Dumbbell Press",targetSets:3,targetReps:12,targetWeight:28,restTimeSec:60},{id:"ex-tricep-pushdown",name:"Cable Tricep Pushdowns",targetSets:4,targetReps:15,targetWeight:35,restTimeSec:60}]},{id:"pull-day",name:"Pull Day",exercises:[{id:"ex-lat-pulldown",name:"Wide-Grip Lat Pulldown",targetSets:4,targetReps:10,targetWeight:65,restTimeSec:90},{id:"ex-barbell-row",name:"Bent-Over Barbell Row",targetSets:4,targetReps:8,targetWeight:75,restTimeSec:90},{id:"ex-face-pull",name:"Rope Face Pulls",targetSets:3,targetReps:15,targetWeight:25,restTimeSec:60},{id:"ex-bicep-curl",name:"EZ-Bar Bicep Curls",targetSets:3,targetReps:12,targetWeight:30,restTimeSec:60}]},{id:"leg-day",name:"Leg Day",exercises:[{id:"ex-squat",name:"Barbell Back Squat",targetSets:4,targetReps:8,targetWeight:100,restTimeSec:120},{id:"ex-rdl",name:"Romanian Deadlift (RDL)",targetSets:3,targetReps:10,targetWeight:90,restTimeSec:90},{id:"ex-leg-extension",name:"Machine Leg Extension",targetSets:3,targetReps:15,targetWeight:55,restTimeSec:60},{id:"ex-calf-raise",name:"Standing Calf Raises",targetSets:4,targetReps:15,targetWeight:80,restTimeSec:60}]}],W=V,O={unit:"kg",soundEnabled:!0,defaultRestTimeSec:90};class J{constructor(){this.overlayEl=null,this.init()}init(){const e=document.getElementById("modal-root");this.overlayEl=document.createElement("div"),this.overlayEl.className="modal-overlay",e.appendChild(this.overlayEl),this.overlayEl.addEventListener("click",t=>{t.target===this.overlayEl&&this.close()})}open(e){this.overlayEl.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        ${e}
      </div>
    `,this.overlayEl.classList.add("open")}close(){this.overlayEl.classList.remove("open")}showAddRoutineModal(e){this.open(`
      <h3 style="font-size: 20px; margin-bottom: 16px;">Create New Program</h3>
      <div class="form-group">
        <label class="form-label">Program Name (e.g., Push Day, Cardio & Abs)</label>
        <input type="text" id="modal-routine-name" class="form-input" placeholder="e.g. Upper Body Power" autocomplete="off" />
      </div>
      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <button class="btn btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" id="modal-save-routine-btn">Create Program</button>
      </div>
    `),this.overlayEl.querySelector("#modal-cancel-btn").addEventListener("click",()=>this.close());const l=this.overlayEl.querySelector("#modal-routine-name");l.focus(),this.overlayEl.querySelector("#modal-save-routine-btn").addEventListener("click",()=>{const i=l.value.trim();if(!i)return;const a={id:"program_"+Date.now(),name:i,exercises:[]};g.addRoutine(a),e&&e(a),this.close()})}showExerciseModal(e,t=null,l){const i=!!t,h=g.getSettings().unit||"kg",d=t?t.name:"",v=t?t.targetSets:4,m=t?t.targetReps:10,n=t?t.targetWeight:60,p=t?t.restTimeSec:90,o=t&&t.unit?t.unit:h,w=`
      <h3 style="font-size: 20px; margin-bottom: 16px;">${i?"Edit Exercise":"Add New Exercise"}</h3>
      
      <div class="form-group">
        <label class="form-label">Exercise Name</label>
        <input type="text" id="ex-name-input" class="form-input" placeholder="e.g. Dumbbell Incline Press" value="${d}" autocomplete="off" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Target Sets</label>
          <input type="number" id="ex-sets-input" class="form-input" value="${v}" min="1" max="20" />
        </div>
        <div class="form-group">
          <label class="form-label">Target Reps</label>
          <input type="number" id="ex-reps-input" class="form-input" value="${m}" min="1" max="100" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Target Weight & Unit</label>
          <div style="display: flex; gap: 6px;">
            <input type="number" id="ex-weight-input" class="form-input" value="${n}" min="0" step="0.5" style="flex: 1;" />
            <select id="ex-unit-input" class="form-select" style="width: 78px; padding: 10px 6px; font-weight: 700; text-transform: uppercase;">
              <option value="kg" ${o==="kg"?"selected":""}>KG</option>
              <option value="lbs" ${o==="lbs"?"selected":""}>LBS</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Rest Time (sec)</label>
          <select id="ex-rest-input" class="form-select">
            <option value="30" ${p===30?"selected":""}>30 sec</option>
            <option value="60" ${p===60?"selected":""}>60 sec</option>
            <option value="90" ${p===90?"selected":""}>90 sec (1.5 min)</option>
            <option value="120" ${p===120?"selected":""}>120 sec (2 min)</option>
            <option value="180" ${p===180?"selected":""}>180 sec (3 min)</option>
            <option value="300" ${p===300?"selected":""}>300 sec (5 min)</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <button class="btn btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" id="modal-save-ex-btn">${i?"Save Changes":"Add Exercise"}</button>
      </div>
    `;this.open(w),this.overlayEl.querySelector("#modal-cancel-btn").addEventListener("click",()=>this.close());const b=this.overlayEl.querySelector("#ex-name-input");b.focus(),this.overlayEl.querySelector("#modal-save-ex-btn").addEventListener("click",()=>{const u=b.value.trim();if(!u)return;const r=parseInt(this.overlayEl.querySelector("#ex-sets-input").value)||3,c=parseInt(this.overlayEl.querySelector("#ex-reps-input").value)||10,y=parseFloat(this.overlayEl.querySelector("#ex-weight-input").value)||0,x=parseInt(this.overlayEl.querySelector("#ex-rest-input").value)||90,L=this.overlayEl.querySelector("#ex-unit-input").value||h,S=g.getRoutines().find(k=>k.id===e);S&&(i?S.exercises=S.exercises.map(k=>k.id===t.id?{...k,name:u,targetSets:r,targetReps:c,targetWeight:y,restTimeSec:x,unit:L}:k):S.exercises.push({id:"ex_"+Date.now(),name:u,targetSets:r,targetReps:c,targetWeight:y,restTimeSec:x,unit:L}),g.updateRoutine(S),l&&l(),this.close())})}}const M=new J,T={PROGRAMS:"replog_programs_v1",ROUTINES:"replog_routines_v1",HISTORY:"replog_history_v1",SETTINGS:"replog_settings_v1",ACTIVE_WORKOUT:"replog_active_workout_v1"};class Y{constructor(){this.listeners=new Set,this.state={routines:[],programs:[],history:[],settings:{...O},activeWorkout:null,activeTab:"today"},this.init()}init(){const e=localStorage.getItem(T.PROGRAMS)||localStorage.getItem(T.ROUTINES);if(e)try{this.state.routines=JSON.parse(e),this.state.programs=this.state.routines}catch(a){console.error("Error parsing programs from storage, using defaults:",a),this.state.routines=JSON.parse(JSON.stringify(W)),this.state.programs=this.state.routines}else this.state.routines=JSON.parse(JSON.stringify(W)),this.state.programs=this.state.routines,this.saveRoutines();const t=localStorage.getItem(T.HISTORY);if(t)try{this.state.history=JSON.parse(t)}catch{this.state.history=[]}const l=localStorage.getItem(T.SETTINGS);if(l)try{this.state.settings={...O,...JSON.parse(l)}}catch{this.state.settings={...O}}const i=localStorage.getItem(T.ACTIVE_WORKOUT);if(i)try{this.state.activeWorkout=JSON.parse(i)}catch{this.state.activeWorkout=null}}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}setActiveTab(e){e==="routines"&&(e="programs"),this.state.activeTab!==e&&(this.state.activeTab=e,this.notify())}saveRoutines(){this.state.programs=this.state.routines,localStorage.setItem(T.PROGRAMS,JSON.stringify(this.state.routines)),localStorage.setItem(T.ROUTINES,JSON.stringify(this.state.routines))}savePrograms(){this.saveRoutines()}getPrograms(){return this.state.routines}addProgram(e){this.addRoutine(e)}updateProgram(e){this.updateRoutine(e)}deleteProgram(e){this.deleteRoutine(e)}getRoutines(){return this.state.routines}addRoutine(e){this.state.routines.push(e),this.saveRoutines(),this.notify()}updateRoutine(e){const t=this.state.routines.findIndex(l=>l.id===e.id);t!==-1&&(this.state.routines[t]=e,this.saveRoutines(),this.notify())}deleteRoutine(e){this.state.routines=this.state.routines.filter(t=>t.id!==e),this.saveRoutines(),this.notify()}startWorkout(e){const t=this.state.routines.find(i=>i.id===e);if(!t)return;if(!t.exercises||t.exercises.length===0){alert(`Cannot start workout: "${t.name}" has no exercises yet. Please add exercises first!`),this.setActiveTab("programs"),setTimeout(()=>{M.showExerciseModal(t.id)},80);return}const l=t.exercises.map(i=>{const a=[];for(let h=0;h<(i.targetSets||3);h++)a.push({setNumber:h+1,weight:i.targetWeight||50,reps:i.targetReps||10,completed:!1});return{...i,sets:a}});this.state.activeWorkout={id:"workout_"+Date.now(),routineId:t.id,routineName:t.name,startTime:Date.now(),exercises:l},localStorage.setItem(T.ACTIVE_WORKOUT,JSON.stringify(this.state.activeWorkout)),this.notify()}updateSetProgress(e,t,l){if(!this.state.activeWorkout)return;const i=this.state.activeWorkout.exercises.find(a=>a.id===e);i&&i.sets[t]&&(i.sets[t]={...i.sets[t],...l},localStorage.setItem(T.ACTIVE_WORKOUT,JSON.stringify(this.state.activeWorkout)),this.notify())}toggleSetComplete(e,t){if(!this.state.activeWorkout)return null;const l=this.state.activeWorkout.exercises.find(i=>i.id===e);if(l&&l.sets[t]){const i=l.sets[t].completed;if(l.sets[t].completed=!i,localStorage.setItem(T.ACTIVE_WORKOUT,JSON.stringify(this.state.activeWorkout)),this.notify(),!i)return{exerciseName:l.name,restTimeSec:l.restTimeSec||this.state.settings.defaultRestTimeSec||90}}return null}finishActiveWorkout(){if(!this.state.activeWorkout)return;const e=Date.now(),t=Math.round((e-this.state.activeWorkout.startTime)/1e3);let l=0,i=0;const a=[];this.state.activeWorkout.exercises.forEach(d=>{let v=0,m=0;const n=[];d.sets.forEach(p=>{if(p.completed){m++,i++;const o=(p.weight||0)*(p.reps||0);v+=o,l+=o,n.push({setNumber:p.setNumber,weight:p.weight,reps:p.reps})}}),m>0&&a.push({id:d.id,name:d.name,setsPerformed:m,volume:v,sets:n})});const h={id:"hist_"+Date.now(),routineId:this.state.activeWorkout.routineId,routineName:this.state.activeWorkout.routineName,date:Date.now(),durationSec:t,totalVolume:l,totalCompletedSets:i,exercises:a};return this.state.history.unshift(h),localStorage.setItem(T.HISTORY,JSON.stringify(this.state.history)),this.state.activeWorkout=null,localStorage.removeItem(T.ACTIVE_WORKOUT),this.notify(),h}cancelActiveWorkout(){this.state.activeWorkout=null,localStorage.removeItem(T.ACTIVE_WORKOUT),this.notify()}getHistory(){return this.state.history}deleteHistoryItem(e){this.state.history=this.state.history.filter(t=>t.id!==e),localStorage.setItem(T.HISTORY,JSON.stringify(this.state.history)),this.notify()}clearHistory(){this.state.history=[],localStorage.setItem(T.HISTORY,JSON.stringify(this.state.history)),this.notify()}getSettings(){return this.state.settings}updateSettings(e){this.state.settings={...this.state.settings,...e},localStorage.setItem(T.SETTINGS,JSON.stringify(this.state.settings)),this.notify()}exportDataJSON(){const e={version:"1.0",exportDate:new Date().toISOString(),routines:this.state.routines,history:this.state.history,settings:this.state.settings};return JSON.stringify(e,null,2)}importDataJSON(e){try{const t=JSON.parse(e);return t.routines&&Array.isArray(t.routines)&&(this.state.routines=t.routines,this.saveRoutines()),t.history&&Array.isArray(t.history)&&(this.state.history=t.history,localStorage.setItem(T.HISTORY,JSON.stringify(this.state.history))),t.settings&&(this.state.settings={...O,...t.settings},localStorage.setItem(T.SETTINGS,JSON.stringify(this.state.settings))),this.notify(),{success:!0}}catch(t){return{success:!1,error:t.message}}}resetToDefaultData(){this.state.routines=JSON.parse(JSON.stringify(W)),this.state.programs=this.state.routines,this.state.settings={...O},this.saveRoutines(),localStorage.setItem(T.SETTINGS,JSON.stringify(this.state.settings)),this.notify()}playChime(){if(this.state.settings.soundEnabled)try{const e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),l=e.createGain();t.type="sine",t.frequency.setValueAtTime(587.33,e.currentTime),t.frequency.exponentialRampToValueAtTime(880,e.currentTime+.15),l.gain.setValueAtTime(.4,e.currentTime),l.gain.exponentialRampToValueAtTime(.001,e.currentTime+.8),t.connect(l),l.connect(e.destination),t.start(),t.stop(e.currentTime+.8)}catch(e){console.warn("Web Audio API not allowed or supported:",e)}}}const g=new Y;function _(s){const e=document.createElement("nav");return e.className="navbar",[{id:"today",label:"Workout",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
             </svg>`},{id:"programs",label:"Programs",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
             </svg>`},{id:"history",label:"History",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>`},{id:"settings",label:"Settings",icon:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
               <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>`}].forEach(l=>{const i=document.createElement("button"),a=s===l.id||l.id==="programs"&&s==="routines";i.className=`nav-item ${a?"active":""}`,i.innerHTML=`${l.icon}<span>${l.label}</span>`,i.addEventListener("click",()=>{g.setActiveTab(l.id)}),e.appendChild(i)}),e}class G{constructor(){this.interval=null,this.remainingSec=0,this.totalSec=0,this.exerciseName="",this.widgetEl=null,this.timeTextEl=null,this.titleEl=null}init(){this.widgetEl=document.createElement("div"),this.widgetEl.className="rest-timer-widget",this.widgetEl.innerHTML=`
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
    `,document.body.appendChild(this.widgetEl),this.timeTextEl=this.widgetEl.querySelector("#timer-time-display"),this.titleEl=this.widgetEl.querySelector("#timer-exercise-name"),this.widgetEl.querySelector("#timer-minus-15").addEventListener("click",()=>this.adjustTime(-15)),this.widgetEl.querySelector("#timer-plus-15").addEventListener("click",()=>this.adjustTime(15)),this.widgetEl.querySelector("#timer-skip-btn").addEventListener("click",()=>this.stop())}start(e,t="Rest Time"){this.widgetEl||this.init(),this.totalSec=Math.max(5,e),this.remainingSec=this.totalSec,this.exerciseName=t,this.titleEl.textContent=`Rest after ${t}`,this.updateUI(),this.widgetEl.classList.add("visible"),this.interval&&clearInterval(this.interval),this.interval=setInterval(()=>{this.remainingSec--,this.remainingSec<=0?(this.remainingSec=0,this.updateUI(),clearInterval(this.interval),this.interval=null,g.playChime(),this.titleEl.textContent="REST TIME UP!",this.timeTextEl.style.color="#FF3366",setTimeout(()=>{this.stop()},3e3)):this.updateUI()},1e3)}adjustTime(e){this.remainingSec=Math.max(0,this.remainingSec+e),this.totalSec=Math.max(this.totalSec,this.remainingSec),this.updateUI()}updateUI(){if(!this.timeTextEl)return;const e=Math.floor(this.remainingSec/60),t=this.remainingSec%60;this.timeTextEl.textContent=`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`,this.timeTextEl.style.color="var(--accent-cyan)";const l=this.widgetEl.querySelector("#timer-ring-progress");if(l&&this.totalSec>0){const a=125.6*(1-this.remainingSec/this.totalSec);l.style.strokeDashoffset=a}}stop(){this.interval&&(clearInterval(this.interval),this.interval=null),this.widgetEl&&this.widgetEl.classList.remove("visible")}}const P=new G;function U(){const s=document.createElement("div");s.className="view-container";const{activeWorkout:e,routines:t,settings:l}=g.state,i=l.unit||"kg";if(e){const a=Math.round((Date.now()-e.startTime)/1e3),h=o=>{const w=Math.floor(o/60),b=o%60;return`${String(w).padStart(2,"0")}:${String(b).padStart(2,"0")}`};let d=0,v=0;e.exercises.forEach(o=>{o.sets.forEach(w=>{v++,w.completed&&d++})}),s.innerHTML=`
      <!-- Active Workout Header Bar -->
      <div class="card" style="background: linear-gradient(145deg, #161920 0%, #1D2330 100%); border: 1px solid var(--border-glow); padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan); animation: pulsePR 1.5s infinite;"></span>
              <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em;">LIVE WORKOUT</span>
            </div>
            <h1 style="font-size: 22px; color: var(--text-primary); margin-top: 4px;">${e.routineName}</h1>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">ELAPSED TIME</div>
            <div class="mono" style="font-size: 20px; font-weight: 800; color: var(--text-primary);" id="live-workout-timer">${h(a)}</div>
          </div>
        </div>

        <div style="margin-top: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; height: 8px; overflow: hidden; position: relative;">
          <div style="background: var(--accent-purple-gradient); height: 100%; width: ${v?Math.round(d/v*100):0}%; transition: width 0.3s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-top: 6px; font-weight: 600;">
          <span>Completed: <strong style="color: var(--accent-cyan);">${d}</strong> / ${v} sets</span>
          <span>${v?Math.round(d/v*100):0}% Done</span>
        </div>
      </div>

      <!-- Exercise Cards -->
      <div id="active-exercises-list" style="display: flex; flex-direction: column; gap: 16px;"></div>

      <!-- Footer Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px; margin-bottom: 24px;">
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
    `;const m=s.querySelector("#live-workout-timer"),n=setInterval(()=>{if(!document.body.contains(m)||!g.state.activeWorkout){clearInterval(n);return}const o=Math.round((Date.now()-g.state.activeWorkout.startTime)/1e3);m&&(m.textContent=h(o))},1e3),p=s.querySelector("#active-exercises-list");e.exercises.forEach(o=>{const w=o.unit||i,b=document.createElement("div");b.className="exercise-card",b.innerHTML=`
        <div class="exercise-title-row">
          <div class="exercise-title">
            <span>${o.name}</span>
          </div>
        </div>

        <!-- Table header labels -->
        <div style="display: grid; grid-template-columns: 32px 1fr 1fr 38px; gap: 5px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; padding: 0 4px;">
          <span style="text-align: center;">Set</span>
          <span style="text-align: center;">Weight (${w.toUpperCase()})</span>
          <span style="text-align: center;">Reps</span>
          <span style="text-align: center;">Done</span>
        </div>

        <div class="sets-table">
          ${o.sets.map((u,r)=>`
            <div class="set-row ${u.completed?"completed":""}" data-set-index="${r}">
              <div class="set-number">${u.setNumber}</div>
              
              <!-- Weight Stepper -->
              <div class="stepper-group">
                <button class="stepper-btn weight-minus-btn" type="button" title="Decrease weight">-</button>
                <input type="number" step="any" inputmode="decimal" class="stepper-input weight-input" value="${u.weight}" title="Tap to enter weight manually">
                <button class="stepper-btn weight-plus-btn" type="button" title="Increase weight">+</button>
              </div>

              <!-- Reps Stepper -->
              <div class="stepper-group">
                <button class="stepper-btn reps-minus-btn" type="button" title="Decrease reps">-</button>
                <input type="number" step="1" inputmode="numeric" class="stepper-input reps-input" value="${u.reps}" title="Tap to enter reps manually">
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
      `,o.sets.forEach((u,r)=>{const c=b.querySelector(`.set-row[data-set-index="${r}"]`),y=c.querySelector(".weight-input"),x=c.querySelector(".reps-input");c.querySelector(".weight-minus-btn").addEventListener("click",()=>{g.updateSetProgress(o.id,r,{weight:Math.max(0,u.weight-2.5)})}),c.querySelector(".weight-plus-btn").addEventListener("click",()=>{g.updateSetProgress(o.id,r,{weight:u.weight+2.5})});const L=()=>{const k=parseFloat(y.value);!isNaN(k)&&k!==u.weight&&g.updateSetProgress(o.id,r,{weight:Math.max(0,k)})};y.addEventListener("change",L),y.addEventListener("blur",L),c.querySelector(".reps-minus-btn").addEventListener("click",()=>{g.updateSetProgress(o.id,r,{reps:Math.max(1,u.reps-1)})}),c.querySelector(".reps-plus-btn").addEventListener("click",()=>{g.updateSetProgress(o.id,r,{reps:u.reps+1})});const S=()=>{const k=parseInt(x.value,10);!isNaN(k)&&k!==u.reps&&g.updateSetProgress(o.id,r,{reps:Math.max(1,k)})};x.addEventListener("change",S),x.addEventListener("blur",S),c.querySelector(".set-check-btn").addEventListener("click",()=>{const k=g.toggleSetComplete(o.id,r);k&&P.start(k.restTimeSec,k.exerciseName)})}),b.querySelector(".add-extra-set-btn").addEventListener("click",()=>{const u=o.sets[o.sets.length-1]||{weight:50,reps:10};o.sets.push({setNumber:o.sets.length+1,weight:u.weight,reps:u.reps,completed:!1}),g.notify()}),p.appendChild(b)}),s.querySelector("#finish-workout-btn").addEventListener("click",()=>{confirm("Great job! Finish and save this workout to your history?")&&(P.stop(),g.finishActiveWorkout(),g.setActiveTab("history"))}),s.querySelector("#cancel-workout-btn").addEventListener("click",()=>{confirm("Are you sure you want to discard this workout without saving?")&&(P.stop(),g.cancelActiveWorkout())})}else{s.innerHTML=`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
        <div>
          <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.08em;">RepLog</span>
          <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Start Workout</h1>
        </div>
        
      </div>

      <p style="color: var(--text-secondary); font-size: 14px;">Select your planned program for today to begin logging sets, weights, and rest times.</p>

      <!-- Program Selection Pills -->
      <div class="pill-selector" id="routine-pills"></div>

      <!-- Preview Selected Program Card -->
      <div id="selected-routine-preview" style="display: flex; flex-direction: column; gap: 16px;"></div>
    `;const a=s.querySelector("#routine-pills"),h=s.querySelector("#selected-routine-preview");if(t.length===0){h.innerHTML=`
        <div class="empty-state card">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p>No programs created yet.</p>
          <button class="btn btn-primary" id="goto-routines-btn">Go to Programs Planner</button>
        </div>
      `;const m=h.querySelector("#goto-routines-btn");return m&&m.addEventListener("click",()=>g.setActiveTab("programs")),s}let d=t[0].id;const v=m=>{const n=t.find(o=>o.id===m);if(!n)return;a.querySelectorAll(".pill-btn").forEach(o=>{o.dataset.id===n.id?o.classList.add("active"):o.classList.remove("active")});const p=n.exercises.length;if(n.exercises.reduce((o,w)=>o+(w.targetSets||3),0),p===0){h.innerHTML=`
          <div class="card card-glass" style="border-color: rgba(255, 183, 3, 0.4);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="exercise-meta-badge" style="background: rgba(255, 183, 3, 0.15); color: #FFB703;">0 Exercises • Empty Program</span>
                <h2 style="font-size: 22px; margin-top: 8px;">${n.name}</h2>
              </div>
            </div>

            <div style="background: rgba(255, 183, 3, 0.12); border: 1px dashed rgba(255, 183, 3, 0.5); padding: 16px; border-radius: 10px; color: #FFB703; font-size: 14px; margin: 16px 0; text-align: center;">
              <svg style="margin: 0 auto 8px auto; display: block;" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <strong>Cannot Start Workout Yet</strong>
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">Please add at least one exercise to "${n.name}" before starting your workout.</p>
            </div>

            <button class="btn btn-primary btn-full" id="redirect-add-ex-btn" style="padding: 16px; font-size: 16px; background: var(--accent-cyan); color: #0A0C0F;">
              + Add Exercises to "${n.name}"
            </button>
          </div>
        `,h.querySelector("#redirect-add-ex-btn").addEventListener("click",()=>{g.setActiveTab("programs"),setTimeout(()=>{M.showExerciseModal(n.id)},80)});return}h.innerHTML=`
        <div class="card card-glass" style="border-color: rgba(0, 245, 212, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              
              <h2 style="font-size: 22px; margin-top: 8px;">${n.name}</h2>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
            ${n.exercises.map(o=>`
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-surface-2); border-radius: 8px; font-size: 14px;">
                <span style="font-weight: 600; color: var(--text-primary);">${o.name}</span>
                <span class="mono" style="color: var(--text-secondary); font-size: 13px;">${o.targetSets} × ${o.targetReps} @ ${o.targetWeight} ${(o.unit||i).toUpperCase()}</span>
              </div>
            `).join("")}
          </div>

          <button class="btn btn-primary btn-full" id="start-btn" style="padding: 16px; font-size: 16px; margin-top: 16px; margin-bottom: 24px;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            Start Today's Workout
          </button>
        </div>
      `,h.querySelector("#start-btn").addEventListener("click",()=>{if(n.exercises.length===0){g.setActiveTab("programs"),setTimeout(()=>{M.showExerciseModal(n.id)},80);return}g.startWorkout(n.id)})};t.forEach(m=>{const n=document.createElement("button");n.className="pill-btn",n.textContent=m.name,n.dataset.id=m.id,n.addEventListener("click",()=>{d=m.id,v(d)}),a.appendChild(n)}),v(d)}return s}const C=new Set;function K(){const s=document.createElement("div");s.className="view-container";const{routines:e,settings:t}=g.state,l=e,i=t.unit||"kg";s.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
      <div>
        <span style="font-size: 12px; font-weight: 700; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 0.08em;">Plan & Templates</span>
        <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Programs</h1>
      </div>
      <button class="btn btn-primary" id="create-routine-btn" style="padding: 10px 16px; font-size: 14px;">
        + New Program
      </button>
    </div>

    <p style="color: var(--text-secondary); font-size: 14px;">
      Manage your workout programs and exercises.
    </p>

    <div id="routines-list" style="display: flex; flex-direction: column; gap: 20px; margin-top: 8px;"></div>
  `,s.querySelector("#create-routine-btn").addEventListener("click",()=>{M.showAddRoutineModal(d=>{d&&d.id&&C.add(d.id)})});const a=s.querySelector("#routines-list");if(l.length===0){a.innerHTML=`
      <div class="empty-state card">
        <p>You haven't created any programs yet.</p>
        <button class="btn btn-secondary" id="empty-add-btn">+ Create First Program</button>
      </div>
    `;const d=a.querySelector("#empty-add-btn");return d&&d.addEventListener("click",()=>M.showAddRoutineModal(v=>{v&&v.id&&C.add(v.id)})),s}const h=(d,v,m,n)=>{let p=!1,o=null;const w=c=>{c.preventDefault(),p=!0,v.classList.add("holding"),d.classList.add("dragging-item")},b=c=>{o=setTimeout(()=>{w(c)},150)},u=c=>{if(!p)return;c.preventDefault();const y=c.touches?c.touches[0].clientY:c.clientY,x=d.parentNode,L=Array.from(x.children).filter(S=>S!==d&&S.style.display!=="none");for(let S of L){const k=S.getBoundingClientRect(),D=k.top+k.height/2;if(y<D&&d.nextElementSibling!==S){if(S.getBoundingClientRect().top<d.getBoundingClientRect().top){x.insertBefore(d,S);break}}else if(y>D&&d.previousElementSibling!==S&&S.getBoundingClientRect().top>d.getBoundingClientRect().top){x.insertBefore(S,d);break}}},r=()=>{if(o&&clearTimeout(o),!p)return;p=!1,v.classList.remove("holding"),d.classList.remove("dragging-item");const c=d.parentNode,y=Array.from(c.children).map(S=>S.dataset.itemId).filter(Boolean),x=m(),L=[];y.forEach(S=>{const k=x.find(D=>D.id===S);k&&L.push(k)}),L.length===x.length&&n(L)};v.addEventListener("touchstart",b,{passive:!1}),v.addEventListener("mousedown",b),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("mousemove",u),window.addEventListener("touchend",r),window.addEventListener("touchcancel",r),window.addEventListener("mouseup",r)};return e.forEach(d=>{const v=C.has(d.id),m=document.createElement("div");m.className="card",m.dataset.itemId=d.id,m.style.display="flex",m.style.flexDirection="column",m.style.gap="14px",m.style.borderLeft="4px solid var(--accent-cyan)",m.innerHTML=`
      <div class="program-header-row" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;" title="Click to expand / collapse program exercises">
        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
          <!-- Program Reorder Touch & Hold Handle -->
          <div class="reorder-handle routine-reorder-handle" title="Touch & hold to reorder programs">⋮⋮</div>
          <!-- Collapse Toggle Chevron -->
          <button class="stepper-btn toggle-collapse-btn" type="button" style="width: 32px; height: 32px; flex-shrink: 0; font-size: 14px; background: var(--bg-surface-3); color: var(--accent-cyan); border: 1px solid var(--border-subtle); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;" title="Expand / Collapse Program">
            <svg class="chevron-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="transform: ${v?"rotate(0deg)":"rotate(-90deg)"}; transition: transform 0.2s ease;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div style="flex: 1; max-width: 260px;">
            <input type="text" class="routine-name-input" value="${d.name}" title="Click or select to rename program" spellcheck="false" autocomplete="off" />
            <span style="font-size: 12px; color: var(--text-muted); font-weight: 600; display: block; margin-top: 2px;">${d.exercises.length} Exercises Planned</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn btn-secondary add-ex-btn" type="button" style="padding: 8px 12px; font-size: 13px; border-color: var(--accent-cyan); color: var(--accent-cyan);">
            + Add Exercise
          </button>
          <button class="stepper-btn delete-routine-btn" type="button" style="color: var(--accent-coral); background: rgba(255, 51, 102, 0.1);" title="Delete Program Day">
            ✕
          </button>
        </div>
      </div>

      <!-- Exercise List for this Program -->
      <div class="routine-exercises-sublist" style="display: ${v?"flex":"none"}; flex-direction: column; gap: 8px; margin-top: 4px;">
        ${d.exercises.length===0?`
          <div style="text-align: center; padding: 20px; background: var(--bg-surface-2); border-radius: 10px; color: var(--text-muted); font-size: 13px;">
            No exercises added yet. Click "+ Add Exercise" above!
          </div>
        `:""}

        ${d.exercises.map(r=>{const c=r.unit||i;return`
            <div class="exercise-item-row" data-item-id="${r.id}" data-ex-id="${r.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--bg-surface-2); border-radius: 10px; border: 1px solid var(--border-subtle); cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <!-- Exercise Touch & Hold Reorder Handle -->
                <div class="reorder-handle ex-reorder-handle" title="Touch & hold to reorder exercise">⋮⋮</div>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${r.name}</span>
                  <span class="mono" style="font-size: 13px; color: var(--accent-cyan);">
                    ${r.targetSets||4} sets × ${r.targetReps||10} reps @ ${r.targetWeight||50} ${c.toUpperCase()}
                  </span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; background: var(--bg-surface-3); color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-weight: 600;">
                  Rest: ${r.restTimeSec||90}s
                </span>
                <!-- Delete Exercise button -->
                <button class="stepper-btn delete-ex-btn" type="button" style="width: 28px; height: 28px; color: var(--accent-coral);" title="Remove exercise">🗑️</button>
              </div>
            </div>
          `}).join("")}
      </div>
    `;const n=m.querySelector(".program-header-row"),p=m.querySelector(".routine-exercises-sublist"),o=m.querySelector(".chevron-icon"),w=r=>{r.target.closest(".routine-name-input")||r.target.closest(".reorder-handle")||r.target.closest(".add-ex-btn")||r.target.closest(".delete-routine-btn")||(C.has(d.id)?(C.delete(d.id),p.style.display="none",o&&(o.style.transform="rotate(-90deg)")):(C.add(d.id),p.style.display="flex",o&&(o.style.transform="rotate(0deg)")))};n.addEventListener("click",w);const b=m.querySelector(".routine-name-input");b&&(b.addEventListener("change",r=>{const c=r.target.value.trim();c&&c!==d.name?g.updateRoutine({...d,name:c}):c||(r.target.value=d.name)}),b.addEventListener("keydown",r=>{r.key==="Enter"&&b.blur()}),b.addEventListener("click",r=>r.stopPropagation()));const u=m.querySelector(".routine-reorder-handle");u&&(u.addEventListener("click",r=>r.stopPropagation()),h(m,u,()=>g.getRoutines(),r=>{g.saveRoutines(r)})),m.querySelector(".add-ex-btn").addEventListener("click",r=>{r.stopPropagation(),C.add(d.id),M.showExerciseModal(d.id)}),m.querySelector(".delete-routine-btn").addEventListener("click",r=>{r.stopPropagation(),confirm(`Delete program "${d.name}"?`)&&(C.delete(d.id),g.deleteRoutine(d.id))}),d.exercises.forEach(r=>{const c=m.querySelector(`.exercise-item-row[data-ex-id="${r.id}"]`);if(!c)return;c.addEventListener("click",x=>{x.target.closest("button")||x.target.closest(".reorder-handle")||M.showExerciseModal(d.id,r)});const y=c.querySelector(".ex-reorder-handle");y&&h(c,y,()=>d.exercises,x=>{g.updateRoutine({...d,exercises:x})}),c.querySelector(".delete-ex-btn").addEventListener("click",x=>{x.stopPropagation();const L=d.exercises.filter(S=>S.id!==r.id);g.updateRoutine({...d,exercises:L})})}),a.appendChild(m)}),s}let R="day",A=new Date,N=new Date,I=new Date,q=new Date;function $(){const s=document.createElement("div");s.className="view-container";const{history:e,settings:t}=g.state,l=t.unit||"kg",i=e.length,a=e.reduce((n,p)=>n+(p.totalVolume||0),0),h=e.reduce((n,p)=>n+(p.totalCompletedSets||0),0);s.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
      <div>
        <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.08em;">Progress & Calendar</span>
        <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Workout History</h1>
      </div>
      ${i>0?`
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
  `;const d=s.querySelector("#clear-all-history-btn");d&&d.addEventListener("click",()=>{confirm("Are you sure you want to permanently delete all workout history?")&&g.clearHistory()}),s.querySelectorAll(".period-tab-btn").forEach(n=>{n.addEventListener("click",()=>{R=n.dataset.period;const p=s.parentNode;p&&p.replaceChild($(),s)})});const v=s.querySelector("#stats-tab-content");if(R==="day"){const n=A.getFullYear(),p=A.getMonth(),w=["January","February","March","April","May","June","July","August","September","October","November","December"][p],b=new Date(n,p,1).getDay(),u=new Date(n,p+1,0).getDate(),r=new Set;e.forEach(f=>{const E=new Date(f.date);E.getFullYear()===n&&E.getMonth()===p&&r.add(E.getDate())});const c=e.filter(f=>new Date(f.date).toDateString()===N.toDateString()),y=c.reduce((f,E)=>f+(E.totalVolume||0),0),x=c.reduce((f,E)=>f+(E.totalCompletedSets||0),0),L=c.reduce((f,E)=>f+(E.exercises?E.exercises.length:0),0),S=N.toDateString()===new Date().toDateString();let k="";for(let f=0;f<b;f++)k+='<div class="calendar-cell empty"></div>';for(let f=1;f<=u;f++){const E=new Date(n,p,f),z=r.has(f),j=E.toDateString()===N.toDateString(),H=E.toDateString()===new Date().toDateString();k+=`
        <div class="calendar-cell ${z?"has-workout":""} ${j?"selected-day":""}" data-day="${f}" title="${E.toLocaleDateString()}: ${z?"Workouts completed!":"No workout"}">
          <span>${f}</span>
          ${z?'<span style="font-size: 8px; margin-top: -2px;">●</span>':""}
          ${H&&!z?'<span style="font-size: 8px; color: var(--accent-cyan); margin-top: -2px;">•</span>':""}
        </div>
      `}v.innerHTML=`
      <!-- Calendar Card -->
      <div class="card" style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="stepper-btn" id="cal-prev-btn" style="width: 32px; height: 32px; font-size: 14px;">◀</button>
          <div style="display: flex; align-items: center; gap: 30px;">
            <h2 style="font-size: 18px; color: var(--text-primary); margin: 0;">${w} ${n}</h2>
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
          ${k}
        </div>
        
      </div>

      <!-- Summarized Day Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #13161C 0%, #1A2230 100%); border-color: rgba(0, 245, 212, 0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 14px; font-weight: 700; color: var(--text-primary);">
            ${S?"Today (":""}${N.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}${S?")":""}
          </span>
          <span class="exercise-meta-badge" style="background: rgba(0, 245, 212, 0.15); color: var(--accent-cyan);">
            ${c.length} Session${c.length===1?"":"s"}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL VOLUME</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: var(--accent-cyan); margin-top: 2px;">
              ${y>=1e4?(y/1e3).toFixed(1)+"k":y.toLocaleString()} ${l.toUpperCase()}
            </div>
          </div>
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL SETS</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">
              ${x}
            </div>
          </div>
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">EXERCISES PLAYED</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: #7B2CBF; margin-top: 2px;">
              ${L}
            </div>
          </div>
        </div>
      </div>

      <!-- What exercise played on what day list -->
      <div>
        
        ${c.length===0?`
          <div class="card empty-state" style="padding: 24px; text-align: center;">
            <p style="color: var(--text-muted); font-size: 13px;">No workouts recorded on ${N.toLocaleDateString()}. Tap on any highlighted date above to inspect completed sessions!</p>
          </div>
        `:""}
        <div id="day-workouts-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>
    `,v.querySelector("#cal-prev-btn").addEventListener("click",()=>{A=new Date(n,p-1,1);const f=s.parentNode;f&&f.replaceChild($(),s)}),v.querySelector("#cal-next-btn").addEventListener("click",()=>{A=new Date(n,p+1,1);const f=s.parentNode;f&&f.replaceChild($(),s)}),v.querySelector("#cal-today-btn").addEventListener("click",()=>{const f=new Date;A=new Date(f.getFullYear(),f.getMonth(),1),N=new Date(f.getFullYear(),f.getMonth(),f.getDate());const E=s.parentNode;E&&E.replaceChild($(),s)}),v.querySelectorAll(".calendar-cell[data-day]").forEach(f=>{f.addEventListener("click",()=>{const E=parseInt(f.dataset.day);N=new Date(n,p,E);const z=s.parentNode;z&&z.replaceChild($(),s)})});const D=v.querySelector("#day-workouts-list");return D&&c.forEach(f=>{D.appendChild(F(f,l))}),s}if(R==="month"){const n=I.getFullYear(),p=I.getMonth(),o=["January","February","March","April","May","June","July","August","September","October","November","December"],w=e.filter(y=>{const x=new Date(y.date);return x.getFullYear()===n&&x.getMonth()===p}),b=w.reduce((y,x)=>y+(x.totalVolume||0),0),u=w.reduce((y,x)=>y+(x.totalCompletedSets||0),0),r=new Set;w.forEach(y=>r.add(new Date(y.date).getDate())),v.innerHTML=`
      <!-- Month Selector Card -->
      <div class="card" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
        <button class="stepper-btn" id="m-prev-btn" style="width: 32px; height: 32px;">◀</button>
        <h2 style="font-size: 20px; color: var(--text-primary); margin: 0;">${o[p]} ${n}</h2>
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
            <div class="mono" style="font-size: 24px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${w.length}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${r.size} unique active days</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 700;">TOTAL VOLUME</div>
            <div class="mono" style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${b>=1e4?(b/1e3).toFixed(1)+"k":b.toLocaleString()} ${l.toUpperCase()}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Across ${u} total sets</div>
          </div>
        </div>
      </div>

      <!-- Workouts list for this month -->
      <div>
        <h3 style="font-size: 16px; color: var(--text-secondary); margin-bottom: 10px;">${o[p]} Logs (${w.length})</h3>
        ${w.length===0?`
          <div class="card empty-state" style="padding: 24px; text-align: center; color: var(--text-muted);">No workouts logged during ${o[p]} ${n}.</div>
        `:""}
        <div id="month-workouts-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>
    `,v.querySelector("#m-prev-btn").addEventListener("click",()=>{I=new Date(n,p-1,1);const y=s.parentNode;y&&y.replaceChild($(),s)}),v.querySelector("#m-next-btn").addEventListener("click",()=>{I=new Date(n,p+1,1);const y=s.parentNode;y&&y.replaceChild($(),s)});const c=v.querySelector("#month-workouts-list");return c&&w.forEach(y=>{c.appendChild(F(y,l))}),s}if(R==="year"){const n=q.getFullYear(),p=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],o=e.filter(u=>new Date(u.date).getFullYear()===n),w=o.reduce((u,r)=>u+(r.totalVolume||0),0);o.reduce((u,r)=>u+(r.totalCompletedSets||0),0);const b=new Set;return o.forEach(u=>b.add(new Date(u.date).getMonth())),v.innerHTML=`
      <!-- Year Selector Card -->
      <div class="card" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
        <button class="stepper-btn" id="y-prev-btn" style="width: 32px; height: 32px;">◀</button>
        <h2 style="font-size: 22px; color: var(--text-primary); margin: 0;">Year ${n}</h2>
        <button class="stepper-btn" id="y-next-btn" style="width: 32px; height: 32px;">▶</button>
      </div>

      <!-- Summarized Year Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #1A1326 0%, #13161C 100%); border-color: rgba(123, 44, 191, 0.4);">
        <h3 style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          🏆 Annual Overview (${n})
        </h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL WORKOUTS</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${o.length}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">ANNUAL VOLUME</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${w>=1e4?(w/1e3).toFixed(1)+"k":w.toLocaleString()}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">ACTIVE MONTHS</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: #7B2CBF; margin-top: 4px;">${b.size} / 12</div>
          </div>
        </div>
      </div>

      <!-- Monthly Breakdown Grid -->
      <div>
        <h3 style="font-size: 15px; color: var(--text-secondary); margin-bottom: 10px;">Monthly Breakdown</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          ${p.map((u,r)=>{const c=o.filter(x=>new Date(x.date).getMonth()===r),y=c.reduce((x,L)=>x+(L.totalVolume||0),0);return`
              <div class="card month-card-btn" data-month="${r}" style="padding: 12px; text-align: center; cursor: pointer; border-color: ${c.length>0?"var(--accent-cyan)":"var(--border-subtle)"}; background: ${c.length>0?"rgba(0, 245, 212, 0.05)":"var(--bg-surface-2)"}; transition: all 0.2s ease;">
                <div style="font-weight: 700; font-size: 14px; color: ${c.length>0?"var(--accent-cyan)":"var(--text-primary)"};">${u}</div>
                <div class="mono" style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${c.length} <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">workouts</span></div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${y?(y>=1e3?(y/1e3).toFixed(1)+"k":y)+" "+l:"0 "+l}</div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,v.querySelector("#y-prev-btn").addEventListener("click",()=>{q=new Date(n-1,0,1);const u=s.parentNode;u&&u.replaceChild($(),s)}),v.querySelector("#y-next-btn").addEventListener("click",()=>{q=new Date(n+1,0,1);const u=s.parentNode;u&&u.replaceChild($(),s)}),v.querySelectorAll(".month-card-btn").forEach(u=>{u.addEventListener("click",()=>{const r=parseInt(u.dataset.month);I=new Date(n,r,1),R="month";const c=s.parentNode;c&&c.replaceChild($(),s)})}),s}v.innerHTML=`
    <!-- Overall Stats Overview Card -->
    <div class="card" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: linear-gradient(135deg, #13161C 0%, #1A2230 100%); border-color: rgba(0, 245, 212, 0.2);">
      <div style="text-align: center;">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">ALL WORKOUTS</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${i}</div>
      </div>
      <div style="text-align: center; border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">TOTAL VOLUME</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${a>=1e4?(a/1e3).toFixed(1)+"k":a.toLocaleString()}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">TOTAL SETS</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: #7B2CBF; margin-top: 4px;">${h}</div>
      </div>
    </div>

    <div id="all-history-list" style="display: flex; flex-direction: column; gap: 14px; margin-top: 4px;"></div>
  `;const m=v.querySelector("#all-history-list");if(e.length===0){m.innerHTML=`
      <div class="empty-state card">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No workouts recorded yet. Head over to Workout and finish a session to see your logs here!</p>
        <button class="btn btn-primary" id="goto-workout-btn">Start Today's Workout</button>
      </div>
    `;const n=m.querySelector("#goto-workout-btn");n&&n.addEventListener("click",()=>g.setActiveTab("today"))}else e.forEach(n=>{m.appendChild(F(n,l))});return s}function F(s,e){const t=document.createElement("div");t.className="card",t.style.display="flex",t.style.flexDirection="column",t.style.gap="12px";const l=a=>new Date(a).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}),i=a=>`${Math.floor(a/60)} min`;return t.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <h2 style="font-size: 18px; color: var(--text-primary);">${s.routineName||"Custom Workout"}</h2>
        <span style="font-size: 12px; color: var(--text-muted);">${l(s.date)} • ⏱️ ${i(s.durationSec||0)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="text-align: right;">
          <div class="mono" style="font-size: 15px; font-weight: 800; color: var(--accent-cyan);">${s.totalVolume?s.totalVolume.toLocaleString():0} ${e.toUpperCase()}</div>
          <div style="font-size: 11px; color: var(--text-secondary);">${s.totalCompletedSets||0} sets</div>
        </div>
        <button class="stepper-btn delete-item-btn" type="button" style="color: var(--accent-coral);" title="Delete entry">✕</button>
      </div>
    </div>

    <!-- Expandable breakdown of exercises -->
    <div class="exercise-breakdown" style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
      ${(s.exercises||[]).map(a=>`
        <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-surface-2); padding: 8px 10px; border-radius: 8px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary);">
            <span>${a.name}</span>
            <span class="mono" style="color: var(--text-secondary); font-size: 12px;">${a.setsPerformed} sets • ${a.volume} ${(a.unit||e).toUpperCase()}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;">
            ${(a.sets||[]).map(h=>`
              <span class="mono" style="background: var(--bg-surface-3); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                #${h.setNumber}: ${h.weight}×${h.reps}
              </span>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `,t.querySelector(".delete-item-btn").addEventListener("click",()=>{confirm("Delete this workout history entry?")&&g.deleteHistoryItem(s.id)}),t}function X(){const s=document.createElement("div");s.className="view-container";const e=g.getSettings();return s.innerHTML=`
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
          <button class="pill-btn ${e.unit==="kg"?"active":""}" id="unit-kg-btn" style="padding: 6px 14px; font-size: 13px;">KG</button>
          <button class="pill-btn ${e.unit==="lbs"?"active":""}" id="unit-lbs-btn" style="padding: 6px 14px; font-size: 13px;">LBS</button>
        </div>
      </div>

      <!-- Rest Timer Chime Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Audio Chime Alerts</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Play subtle beep when rest timer finishes</div>
        </div>
        <button class="pill-btn ${e.soundEnabled?"active":""}" id="sound-toggle-btn" style="padding: 6px 14px; font-size: 13px;">
          ${e.soundEnabled?"ON 🔊":"OFF 🔇"}
        </button>
      </div>

      <!-- Default Rest Time -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Default Rest Interval</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Used when adding new exercises</div>
        </div>
        <select id="default-rest-select" class="form-select" style="width: 140px; padding: 8px 12px;">
          <option value="60" ${e.defaultRestTimeSec===60?"selected":""}>60 sec</option>
          <option value="90" ${e.defaultRestTimeSec===90?"selected":""}>90 sec</option>
          <option value="120" ${e.defaultRestTimeSec===120?"selected":""}>120 sec</option>
          <option value="180" ${e.defaultRestTimeSec===180?"selected":""}>180 sec</option>
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
        ⚠️ Reset to Default Programs
      </button>
      <p style="font-size: 13px; color: var(--text-secondary);">
        Resetting will restore the default starter programs (Push, Pull, Legs) and clear custom modifications.
      </p>
    </div>

    <!-- PWA About -->
    <div style="text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 12px;">
      RepLog PWA v1.0 • Built with Vanilla JS & Mobile-First Ergonomics
    </div>
  `,s.querySelector("#unit-kg-btn").addEventListener("click",()=>{g.updateSettings({unit:"kg"})}),s.querySelector("#unit-lbs-btn").addEventListener("click",()=>{g.updateSettings({unit:"lbs"})}),s.querySelector("#sound-toggle-btn").addEventListener("click",()=>{g.updateSettings({soundEnabled:!e.soundEnabled})}),s.querySelector("#default-rest-select").addEventListener("change",t=>{g.updateSettings({defaultRestTimeSec:parseInt(t.target.value)||90})}),s.querySelector("#export-json-btn").addEventListener("click",()=>{const t=g.exportDataJSON(),l=new Blob([t],{type:"application/json"}),i=URL.createObjectURL(l),a=document.createElement("a");a.href=i,a.download=`RepLog-Backup-${new Date().toISOString().split("T")[0]}.json`,a.click(),URL.revokeObjectURL(i)}),s.querySelector("#import-json-file").addEventListener("change",t=>{const l=t.target.files[0];if(!l)return;const i=new FileReader;i.onload=a=>{const h=g.importDataJSON(a.target.result);h.success?alert("Data successfully imported and restored!"):alert("Failed to import file: "+h.error)},i.readAsText(l)}),s.querySelector("#reset-defaults-btn").addEventListener("click",()=>{confirm("Are you sure you want to reset all programs to the original Push / Pull / Legs starter templates?")&&g.resetToDefaultData()}),s}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(s=>{console.log("RepLog SW registered with scope:",s.scope)}).catch(s=>{console.error("RepLog SW registration failed:",s)})});function B(){const s=document.getElementById("app");if(!s)return;s.innerHTML="";const{activeTab:e}=g.state;let t;switch(e){case"today":t=U();break;case"programs":case"routines":t=K();break;case"history":t=$();break;case"settings":t=X();break;default:t=U()}s.appendChild(t),s.appendChild(_(e))}g.subscribe(()=>{B()});window.addEventListener("DOMContentLoaded",()=>{B()});(document.readyState==="complete"||document.readyState==="interactive")&&B();
