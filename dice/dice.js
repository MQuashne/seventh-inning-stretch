"use strict";

/**
 * @brief generates polyhedral dice with roll animation and result calculation
 * @author Anton Natarov aka Teal (original author)
 * @author Sarah Rosanna Busch (refactor, see changelog)
 * @date 10 Aug 2023
 * @version 1.1
 * @dependencies teal.js, cannon.js, three.js
 */

/**
 * CHANGELOG
 * - tweaked scaling to make dice look nice on mobile
 * - removed dice selector feature (separating UI from dice roller)
 * - file reorg (moving variable declarations to top, followed by public then private functions)
 * - removing true random option (was cool but not worth the extra dependencies or complexity)
 * - removing mouse event bindings (separating UI from dice roller)
 * - refactoring to module pattern and reducing publically available properties/methods
 * - removing dice notation getter callback in favour of setting dice to roll directly
 * - adding sound effect
 * - adding roll results to notation returned in after_roll callback
 * - adding 'd9' option (d10 to be added to d100 properly)
 * - fixed init/resize inside hidden containers: size-dependent setup (camera, light,
 *   barriers, desk) moved out of the constructor and into reinit(), which now no-ops
 *   until the container has real dimensions. Replaced the broken/non-functional
 *   'resize' event binding (elements don't fire native resize events, callback had
 *   wrong `this`, and `elem` was undefined) with a ResizeObserver that calls reinit()
 *   once the container becomes visible/sized. Added camera guards to __animate/render
 *   calls so nothing renders with an undefined camera.
 * - after a roll settles, dice are auto-lined-up along the top edge of the desk
 *   (line_up_dice) so the lower part of the canvas stays clear for a message/options
 *   UI. Configurable via vars.lineup_* and can be skipped by passing false to
 *   start_throw/roll's after_roll usage pattern (see line_up_dice).
 */


//import { FontLoader } from 'https://app.unpkg.com/three@0.160.0/files/examples/jsm/loaders/FontLoader.js';
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export const DICE = (function() {
    var that = {};
    
    var vars = { //todo: make these configurable on init
        frame_rate: 1 / 60,
        scale: 100, //dice size
        
        material_options: {
            specular: 0x172022,
            color: 0xf0f0f0,
            shininess: 30,
            shading: THREE.FlatShading,
        },
        label_color: '#E81828', //numbers on dice
        outline_color: '#ffffff',
        dice_color: '#ffffff',
        stripe_color: '#E81828',
        ambient_light_color: 0xf0f0f0,
        spot_light_color: 0x404040,
        desk_color: '#101010', //canvas background
        desk_opacity: 0,
        use_shadows: true,
        use_adapvite_timestep: true, //todo: setting this to false improves performace a lot. but the dice rolls don't look as natural...
        
        // Where settled dice get tucked after a roll, as a fraction of the desk's
        // half-height/half-width (0 = center, 1 = edge/barrier). y_fraction > 0 is
        // the upper half of the desk, < 0 is the lower half.
        lineup_enabled: true,
        lineup_y_fraction: 0.72,
        lineup_max_spacing_scale: 2.5, //cap spacing at N * vars.scale so few dice don't spread edge-to-edge
        lineup_duration_ms: 500
    }
    console.log(vars.lineup_enabled)
    //const loader=new FontLoader();
    const CONSTS = {
        known_types: ['d4', 'd6', 'd8', 'd9', 'd10', 'd12', 'd20', 'd100'],
        dice_face_range: {
            'd4': [1, 4],
            'd6': [1, 6],
            'd8': [1, 8],
            'd9': [0, 9],
            'd10': [0, 9],
            'd12': [1, 12],
            'd20': [1, 20],
            'd100': [0, 9]
        },
        dice_mass: { 'd4': 300, 'd6': 300, 'd8': 340, 'd9': 350, 'd10': 350, 'd12': 350, 'd20': 400, 'd100': 350 },
        dice_inertia: { 'd4': 5, 'd6': 13, 'd8': 10, 'd9': 9, 'd10': 9, 'd12': 8, 'd20': 6, 'd100': 9 },
        
        standart_d20_dice_face_labels: [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
            '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
        ],
        standart_d100_dice_face_labels: [' ', '00', '10', '20', '30', '40', '50',
            '60', '70', '80', '90'
        ],
        
        d4_labels: [
            [
                [],
                [0, 0, 0],
                [2, 4, 3],
                [1, 3, 4],
                [2, 1, 4],
                [1, 2, 3]
            ],
            [
                [],
                [0, 0, 0],
                [2, 3, 4],
                [3, 1, 4],
                [2, 4, 1],
                [3, 2, 1]
            ],
            [
                [],
                [0, 0, 0],
                [4, 3, 2],
                [3, 4, 1],
                [4, 2, 1],
                [3, 1, 2]
            ],
            [
                [],
                [0, 0, 0],
                [4, 2, 3],
                [1, 4, 3],
                [4, 1, 2],
                [1, 3, 2]
            ]
        ]
    }
    
    // DICE BOX OBJECT
    
    // @brief constructor; create a new instance of this to initialize the canvas
    // @param container element to contain canvas; canvas will fill container
    that.dice_box = function(container) {
        this.dices = [];
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();
        this.diceToRoll = ''; //user input
        this.container = container;
        
        this.renderer = window.WebGLRenderingContext ?
            new THREE.WebGLRenderer({ antialias: true, alpha: true }) :
            new THREE.CanvasRenderer({ antialias: true, alpha: true });
        // Without this, HiDPI/retina screens render at CSS pixel size and get
        // upscaled by the browser, which is a major source of overall blurriness.
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        container.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.setClearColor(0xffffff, 0); //color, alpha
        // Used by the face-label texture generators (create_dice_materials /
        // create_d4_materials) so numbers stay sharp when a die face is viewed
        // at a steep angle. getMaxAnisotropy() is the r73-era API name.
        that.renderer_max_anisotropy = this.renderer.getMaxAnisotropy ?
            this.renderer.getMaxAnisotropy() : 1;
        
        this.world.gravity.set(0, 0, -9.8 * 800);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 16;
        
        var ambientLight = new THREE.AmbientLight(vars.ambient_light_color);
        this.scene.add(ambientLight);
        
        this.dice_body_material = new CANNON.Material();
        this.desk_body_material = new CANNON.Material();
        this.barrier_body_material = new CANNON.Material();
        this.world.addContactMaterial(new CANNON.ContactMaterial(
            this.desk_body_material, this.dice_body_material, 0.01, 0.5));
        this.world.addContactMaterial(new CANNON.ContactMaterial(
            this.barrier_body_material, this.dice_body_material, 0, 1.0));
        this.world.addContactMaterial(new CANNON.ContactMaterial(
            this.dice_body_material, this.dice_body_material, 0, 0.5));
        
        this.world.add(new CANNON.RigidBody(0, new CANNON.Plane(), this.desk_body_material));
        
        // NOTE: barriers used to be created here using this.w/this.h, but those are
        // only known once reinit() has real container dimensions. They're now
        // (re)created inside reinit() itself, alongside the camera/light/desk.
        this.barriers = [];
        
        this.reinit(container);
        
        // Replaces the old, non-functional:
        //   $t.bind(container, 'resize', function() { this.reinit(elem.canvas); });
        // Plain elements never fire a native 'resize' event, `this` inside that
        // callback wasn't the dice_box instance, and `elem` was never defined.
        // ResizeObserver correctly fires when a hidden (0x0) container becomes
        // visible and gets real dimensions, which is exactly when we need to
        // (re)build the camera/light/barriers/desk.
        var box = this;
        if (window.ResizeObserver) {
            this._resizeObserver = new ResizeObserver(function(entries) {
                var rect = entries[0].contentRect;
                if (rect.width === 0 || rect.height === 0) return;
                // Defer the actual reinit work to the next animation frame rather
                // than running it synchronously inside the observer callback.
                // Doing size-changing work (renderer.setSize, DOM/layout reads)
                // directly inside a ResizeObserver callback is what commonly
                // triggers "ResizeObserver loop completed with undelivered
                // notifications" — the browser can't finish delivering this
                // notification if handling it causes another resize in the same
                // pass. The _reinitScheduled guard avoids stacking up redundant
                // reinit calls if multiple resize notifications land before the
                // next frame runs.
                if (box._reinitScheduled) return;
                box._reinitScheduled = true;
                requestAnimationFrame(function() {
                    box._reinitScheduled = false;
                    box.reinit(container);
                });
            });
            this._resizeObserver.observe(container);
        }
        
        this.last_time = 0;
        this.running = false;
        
        // Only render here if reinit() already managed to set up a camera
        // (i.e. the container had a real size at construction time). Otherwise
        // this is a no-op until ResizeObserver triggers reinit().
        if (this.camera) this.renderer.render(this.scene, this.camera);
    }
    
    // called on init and window resize
    that.dice_box.prototype.reinit = function(container) {
        this.cw = container.clientWidth / 2;
        this.ch = container.clientHeight / 2;
        
        // Container is still hidden/zero-sized (e.g. display:none). Bail out
        // cleanly; ResizeObserver will call reinit() again once it has a real
        // size, and nothing here should run against NaN/zero dimensions.
        if (this.cw === 0 || this.ch === 0) return;
        
        this.w = this.cw;
        this.h = this.ch;
        this.aspect = Math.min(this.cw / this.w, this.ch / this.h);
        vars.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 8;
        //console.log('scale = ' + vars.scale);
        
        this.renderer.setSize(this.cw * 2, this.ch * 2);
        
        this.wh = this.ch / this.aspect / Math.tan(10 * Math.PI / 180);
        if (this.camera) this.scene.remove(this.camera);
        this.camera = new THREE.PerspectiveCamera(20, this.cw / this.ch, 1, this.wh * 1.3);
        this.camera.position.z = this.wh;
        
        var mw = Math.max(this.w, this.h);
        if (this.light) this.scene.remove(this.light);
        this.light = new THREE.SpotLight(vars.spot_light_color, 2.0);
        this.light.position.set(-mw / 2, mw / 2, mw * 2);
        this.light.target.position.set(0, 0, 0);
        this.light.distance = mw * 5;
        this.light.castShadow = true;
        this.light.shadowCameraNear = mw / 10;
        this.light.shadowCameraFar = mw * 5;
        this.light.shadowCameraFov = 50;
        this.light.shadowBias = 0.001;
        this.light.shadowDarkness = 0.9;
        this.light.shadowMapWidth = 1024;
        this.light.shadowMapHeight = 1024;
        this.scene.add(this.light);
        
        // (Re)build barriers now that w/h are known/updated. These used to live
        // in the constructor keyed off this.w/this.h before those existed.
        var box = this;
        if (this.barriers && this.barriers.length) {
            this.barriers.forEach(function(b) { box.world.remove(b); });
        }
        this.barriers = [];
        var barrier_defs = [
            { axis: new CANNON.Vec3(1, 0, 0), angle: Math.PI / 2, pos: [0, this.h * 0.93, 0] },
            { axis: new CANNON.Vec3(1, 0, 0), angle: -Math.PI / 2, pos: [0, -this.h * 0.93, 0] },
            { axis: new CANNON.Vec3(0, 1, 0), angle: -Math.PI / 2, pos: [this.w * 0.93, 0, 0] },
            { axis: new CANNON.Vec3(0, 1, 0), angle: Math.PI / 2, pos: [-this.w * 0.93, 0, 0] }
        ];
        barrier_defs.forEach(function(def) {
            var barrier = new CANNON.RigidBody(0, new CANNON.Plane(), box.barrier_body_material);
            barrier.quaternion.setFromAxisAngle(def.axis, def.angle);
            barrier.position.set(def.pos[0], def.pos[1], def.pos[2]);
            box.world.add(barrier);
            box.barriers.push(barrier);
        });
        
        if (this.desk) this.scene.remove(this.desk);
        /*
        new THREE.TextureLoader().load('./public/assets/baseballfield.jpeg', function(deskTexture) {
            
            deskTexture.needsUpdate = true;
            
            // IMPORTANT for r73 stability
            
            deskTexture.generateMipmaps = false;
            
            deskTexture.minFilter = THREE.LinearFilter;
            
            deskTexture.magFilter = THREE.LinearFilter
            
            
            
            
            box.desk = new THREE.Mesh(
                new THREE.PlaneGeometry(box.w * 2, box.h * 2, 1, 1),
                new THREE.MeshPhongMaterial({
                    map: deskTexture,
                    side: THREE.DoubleSide,
                    shininess: 20
                })
            );
            box.desk.receiveShadow = vars.use_shadows;
            box.scene.add(box.desk);
            if (box.camera) box.renderer.render(box.scene, box.camera);
        });
        */
        if (this.camera) this.renderer.render(this.scene, this.camera);
    }
    
    // @param diceToRoll (string), ex: "1d100+1d10+1d4+1d6+1d8+1d12+1d20"
    that.dice_box.prototype.setDice = function(diceToRoll) {
        this.diceToRoll = diceToRoll;
    }
    
    //call this to roll dice programatically or from click
    that.dice_box.prototype.start_throw = function(before_roll, after_roll) {
        var box = this;
        if (box.rolling) return;
        if (!box.camera) return; // container still hidden/unsized; nothing to render into yet
        
        var vector = { x: (rnd() * 2 - 1) * box.w, y: -(rnd() * 2 - 1) * box.h };
        var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        var boost = (rnd() + 3) * dist;
        throw_dices(box, vector, boost, dist, before_roll, after_roll);
    }
    
    //call this to roll dice from swipe (will throw dice in direction swiped)
    that.dice_box.prototype.bind_swipe = function(container, before_roll, after_roll) {
        let box = this;
        $t.bind(container, ['mousedown', 'touchstart'], function(ev) {
            ev.preventDefault();
            box.mouse_time = (new Date()).getTime();
            box.mouse_start = $t.get_mouse_coords(ev);
        });
        $t.bind(container, ['mouseup', 'touchend'], function(ev) {
            if (box.rolling) return;
            if (box.mouse_start == undefined) return;
            var m = $t.get_mouse_coords(ev);
            var vector = { x: m.x - box.mouse_start.x, y: -(m.y - box.mouse_start.y) };
            box.mouse_start = undefined;
            var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            if (dist < Math.sqrt(box.w * box.h * 0.01)) return;
            var time_int = (new Date()).getTime() - box.mouse_time;
            if (time_int > 2000) time_int = 2000;
            var boost = Math.sqrt((2500 - time_int) / 2500) * dist * 2;
            throw_dices(box, vector, boost, dist, before_roll, after_roll);
        });
    }
    
    function throw_dices(box, vector, boost, dist, before_roll, after_roll) {
        var uat = vars.use_adapvite_timestep;
        
        vector.x /= dist;
        vector.y /= dist;
        var notation = that.parse_notation(box.diceToRoll);
        if (notation.set.length == 0) return;
        //TODO: how do large numbers of vectors affect performance?
        var vectors = box.generate_vectors(notation, vector, boost);
        box.rolling = true;
        let request_results = null;
        
        let numDice = vectors.length;
        numDice = numDice > 10 ? 10 : numDice;
        /* for(let i = 0; i < numDice; i++) {
            let volume = i/10;
            if(volume <= 0) volume = 0.1;
            if(volume > 1) volume = 1;
            playSound(box.container, volume);
            //todo: find a better way to do this
        }
*/
        if (before_roll) {
            request_results = before_roll(notation);
        }
        roll(request_results);
        
        //@param request_results (optional) - pass in an array of desired roll results
        //todo: when this param is used, animation isn't as smooth (uat not used?)
        function roll(request_results) {
            box.clear();
            box.roll(vectors, request_results || notation.result, function(result) {
                notation.result = result;
                var res = result.join(' ');
                if (notation.constant) {
                    if (notation.constant > 0) res += ' +' + notation.constant;
                    else res += ' -' + Math.abs(notation.constant);
                }
                notation.resultTotal = (result.reduce(function(s, a) { return s + a; }) + notation.constant);
                if (result.length > 1 || notation.constant) {
                    res += ' = ' + notation.resultTotal;
                }
                notation.resultString = res;
                
                // Tuck the settled dice into a row (top of the desk by default)
                // so the rest of the canvas is free for a result message / options
                // UI to be layered on top without covering the dice themselves.
               
                if (vars.lineup_enabled) box.line_up_dice();
                
                if (after_roll) after_roll(notation);
                
                box.rolling = false;
                vars.use_adapvite_timestep = uat;
            });
        }
    }
    
    //todo: the rest of these don't need to be public, but need to read the this properties
    that.dice_box.prototype.generate_vectors = function(notation, vector, boost) {
        var vectors = [];
        for (var i in notation.set) {
            var vec = make_random_vector(vector);
            var pos = {
                x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
                y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
                z: rnd() * 200 + 200
            };
            var projector = Math.abs(vec.x / vec.y);
            if (projector > 1.0) pos.y /= projector;
            else pos.x *= projector;
            var velvec = make_random_vector(vector);
            var velocity = { x: velvec.x * boost, y: velvec.y * boost, z: -10 };
            var inertia = CONSTS.dice_inertia[notation.set[i]];
            var angle = {
                x: -(rnd() * vec.y * 5 + inertia * vec.y),
                y: rnd() * vec.x * 5 + inertia * vec.x,
                z: 0
            };
            var axis = { x: rnd(), y: rnd(), z: rnd(), a: rnd() };
            vectors.push({ set: notation.set[i], pos: pos, velocity: velocity, angle: angle, axis: axis });
        }
        return vectors;
    }
    
    that.dice_box.prototype.create_dice = function(type, pos, velocity, angle, axis) {
        var dice = threeD_dice['create_' + type]();
        dice.castShadow = true;
        dice.dice_type = type;
        dice.body = new CANNON.RigidBody(CONSTS.dice_mass[type],
            dice.geometry.cannon_shape, this.dice_body_material);
        dice.body.position.set(pos.x, pos.y, pos.z);
        dice.body.quaternion.setFromAxisAngle(new CANNON.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
        dice.body.angularVelocity.set(angle.x, angle.y, angle.z);
        dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
        dice.body.linearDamping = 0.1;
        dice.body.angularDamping = 0.1;
        this.scene.add(dice);
        this.dices.push(dice);
        this.world.add(dice.body);
    }
    
    that.dice_box.prototype.check_if_throw_finished = function() {
        var res = true;
        var e = 6;
        if (this.iteration < 10 / vars.frame_rate) {
            for (var i = 0; i < this.dices.length; ++i) {
                var dice = this.dices[i];
                if (dice.dice_stopped === true) continue;
                var a = dice.body.angularVelocity,
                    v = dice.body.velocity;
                if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
                    Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
                    if (dice.dice_stopped) {
                        if (this.iteration - dice.dice_stopped > 3) {
                            dice.dice_stopped = true;
                            continue;
                        }
                    }
                    else dice.dice_stopped = this.iteration;
                    res = false;
                }
                else {
                    dice.dice_stopped = undefined;
                    res = false;
                }
            }
        }
        return res;
    }
    
    that.dice_box.prototype.emulate_throw = function() {
        while (!this.check_if_throw_finished()) {
            ++this.iteration;
            this.world.step(vars.frame_rate);
        }
        return get_dice_values(this.dices);
    }
    
    that.dice_box.prototype.__animate = function(threadid) {
        console.log("animating")

        if (!this.camera) return; // guard: nothing valid to render into yet
        var time = (new Date()).getTime();
        var time_diff = (time - this.last_time) / 1000;
        if (time_diff > 3) time_diff = vars.frame_rate;
        ++this.iteration;
        if (vars.use_adapvite_timestep) {
            while (time_diff > vars.frame_rate * 1.1) {
                this.world.step(vars.frame_rate);
                time_diff -= vars.frame_rate;
            }
            this.world.step(time_diff);
        }
        else {
            this.world.step(vars.frame_rate);
        }
        for (var i in this.scene.children) {
            var interact = this.scene.children[i];
            if (interact.body != undefined) {
                interact.position.copy(interact.body.position);
                interact.quaternion.copy(interact.body.quaternion);
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.last_time = this.last_time ? time : (new Date()).getTime();
        if (this.running == threadid && this.check_if_throw_finished()) {
            this.running = false;
            if (this.callback) this.callback.call(this, get_dice_values(this.dices));
        }
        if (this.running == threadid) {
            (function(t, tid, uat) {
                if (!uat && time_diff < vars.frame_rate) {
                    setTimeout(function() { requestAnimationFrame(function() { t.__animate(tid); }); },
                        (vars.frame_rate - time_diff) * 1000);
                }
                else requestAnimationFrame(function() { t.__animate(tid); });
            })(this, threadid, vars.use_adapvite_timestep);
        }
    }
    
    // @brief slides the currently settled dice into a single row so the rest of
    // the desk is free for a message/options UI to sit on top of the canvas.
    // Only affects position (x/y/z), never quaternion, so the face that landed
    // "up" stays up — the roll result shown to the player never changes.
    // Runs its own short rAF loop independent of the physics world (which has
    // already stopped by the time a roll finishes), so it won't fight gravity.
    // @param opts (optional) { y_fraction, duration_ms } to override vars.lineup_*
    // for a single call, e.g. box.line_up_dice({ y_fraction: -0.72 }) to line up
    // along the bottom edge instead of the top.
    that.dice_box.prototype.line_up_dice = function(opts) {
        
        
        var box = this;
        var n = this.dices.length;
        if (!n || !this.camera) return;
        opts = opts || {};
        var y_fraction = opts.y_fraction != undefined ? opts.y_fraction : vars.lineup_y_fraction;
        var duration_ms = opts.duration_ms != undefined ? opts.duration_ms : vars.lineup_duration_ms;
        
        var spacing = Math.min(this.w * 0.9 / Math.max(n, 1), vars.scale * vars.lineup_max_spacing_scale);
        var totalWidth = spacing * (n - 1);
        var startX = -totalWidth / 2;
        var targetY = this.h * y_fraction;
        var restZ = vars.scale * 0.6; //small hover above the desk plane
        
        var starts = this.dices.map(function(d) { return d.position.clone(); });
        var targets = this.dices.map(function(d, i) {
            return new THREE.Vector3(startX + i * spacing, targetY, restZ);
        });
        this.dices.forEach(function(d) {
    if (d.body) {
        d.body.velocity.set(0, 0, 0);
        d.body.angularVelocity.set(0, 0, 0);
        box.world.remove(d.body); // fully detach from physics, not just zero it out
    }
});
        // Stop the dice reacting to the physics world while they glide into place.
        this.dices.forEach(function(d) {
            if (d.body) { d.body.velocity.set(0, 0, 0); d.body.angularVelocity.set(0, 0, 0); }
        });
        
        var lineup_id = (this._lineup_id = (this._lineup_id || 0) + 1);
        var startTime = null;
        function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; } //easeInOutQuad
        
       function step(ts) {
    if (box._lineup_id !== lineup_id) return;
    console.log('dices in step:', box.dices.length, 'starts:', starts.length);
            
            if (box._lineup_id !== lineup_id) return; // a newer roll/line-up superseded this one
            if (!startTime) startTime = ts;
            var t = Math.min(1, (ts - startTime) / duration_ms);
            var e = ease(t);
           
            if (box.camera) box.renderer.render(box.scene, box.camera);
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    
    that.dice_box.prototype.clear = function() {
        this.running = false;
        this._lineup_id = (this._lineup_id || 0) + 1; // cancel any in-flight line-up animation
        var dice;
        while (dice = this.dices.pop()) {
            this.scene.remove(dice);
            if (dice.body) this.world.remove(dice.body);
        }
        if (this.pane) this.scene.remove(this.pane);
        if (this.camera) this.renderer.render(this.scene, this.camera);
        var box = this;
        setTimeout(function() { if (box.camera) box.renderer.render(box.scene, box.camera); }, 100);
    }
    
    that.dice_box.prototype.prepare_dices_for_roll = function(vectors) {
        this.clear();
        this.iteration = 0;
        for (var i in vectors) {
            this.create_dice(vectors[i].set, vectors[i].pos, vectors[i].velocity,
                vectors[i].angle, vectors[i].axis);
        }
    }
    
    that.dice_box.prototype.roll = function(vectors, values, callback) {
        this.prepare_dices_for_roll(vectors);
        if (values != undefined && values.length) {
            vars.use_adapvite_timestep = false;
            var res = this.emulate_throw();
            this.prepare_dices_for_roll(vectors);
            for (var i in res)
                shift_dice_faces(this.dices[i], values[i], res[i]);
        }
        this.callback = callback;
        this.running = (new Date()).getTime();
        this.last_time = 0;
        this.__animate(this.running);
    }
    
    that.dice_box.prototype.search_dice_by_mouse = function(ev) {
        var m = $t.get_mouse_coords(ev);
        var intersects = (new THREE.Raycaster(this.camera.position,
            (new THREE.Vector3((m.x - this.cw) / this.aspect,
                1 - (m.y - this.ch) / this.aspect, this.w / 9))
            .sub(this.camera.position).normalize())).intersectObjects(this.dices);
        if (intersects.length) return intersects[0].object.userData;
    }
    
    // @brief stop observing container resizes and release the observer. Call
    // this if you ever destroy/remove a dice_box instance to avoid leaks.
    that.dice_box.prototype.destroy = function() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = undefined;
        }
    }
    
    
    // PUBLIC FUNCTIONS
    
    //validates dice notation input
    //notation should be in format "1d4+2d6"
    that.parse_notation = function(notation) {
        var no = notation.split('@');
        var dr0 = /\s*(\d*)([a-z]+)(\d+)(\s*(\+|\-)\s*(\d+)){0,1}\s*(\+|$)/gi;
        var dr1 = /(\b)*(\d+)(\b)*/gi;
        var ret = {
            set: [], //set of dice to roll
            constant: 0, //modifier to add to result
            result: [], //array of results of each die
            resultTotal: 0, //dice results + constant
            resultString: '', //printable result
            error: false //input errors are ignored gracefully
        };
        var res;
        //looks at each peice of the notation and adds dice and constants to results
        while (res = dr0.exec(no[0])) {
            var command = res[2];
            if (command != 'd') { ret.error = true; continue; }
            var count = parseInt(res[1]);
            if (res[1] == '') count = 1;
            var type = 'd' + res[3];
            if (CONSTS.known_types.indexOf(type) == -1) { ret.error = true; continue; }
            while (count--) ret.set.push(type);
            if (res[5] && res[6]) {
                if (res[5] == '+') ret.constant += parseInt(res[6]);
                else ret.constant -= parseInt(res[6]);
            }
        }
        while (res = dr1.exec(no[1])) {
            ret.result.push(parseInt(res[2]));
        }
        return ret;
    }
    
    that.stringify_notation = function(nn) {
        var dict = {},
            notation = '';
        for (var i in nn.set)
            if (!dict[nn.set[i]]) dict[nn.set[i]] = 1;
            else ++dict[nn.set[i]];
        for (var i in dict) {
            if (notation.length) notation += ' + ';
            notation += (dict[i] > 1 ? dict[i] : '') + i;
        }
        if (nn.constant) {
            if (nn.constant > 0) notation += ' + ' + nn.constant;
            else notation += ' - ' + Math.abs(nn.constant);
        }
        return notation;
    }
    
    that.set_color = function(type, hex) {
        if (type === 'dice') vars.dice_color = hex;
        else if (type === 'label') vars.label_color = hex;
        else if (type === 'stripe') vars.stripe_color = hex;
        else if (type === 'outline') vars.outline_color = hex;
        // force regeneration on next roll
        delete threeD_dice.dice_material;
        delete threeD_dice.d4_material;
        delete threeD_dice.d100_material;
    }
    
    
    // PRIVATE FUNCTIONS
    
    // dice geometries
    let threeD_dice = {};
    
    threeD_dice.create_d4 = function() {
        if (!this.d4_geometry) this.d4_geometry = create_d4_geometry(vars.scale * 1.2);
        if (!this.d4_material) this.d4_material = new THREE.MeshFaceMaterial(
            create_d4_materials(vars.scale / 2, vars.scale * 2, CONSTS.d4_labels[0]));
        return new THREE.Mesh(this.d4_geometry, this.d4_material);
    }
    
    threeD_dice.create_d6 = function() {
        if (!this.d6_geometry) this.d6_geometry = create_d6_geometry(vars.scale * 1.1);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            create_dice_materials(CONSTS.standart_d20_dice_face_labels, vars.scale / 2, 0.9));
        return new THREE.Mesh(this.d6_geometry, this.dice_material);
    }
    
    threeD_dice.create_d8 = function() {
        if (!this.d8_geometry) this.d8_geometry = create_d8_geometry(vars.scale);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            create_dice_materials(CONSTS.standart_d20_dice_face_labels, vars.scale / 2, 1.4));
        return new THREE.Mesh(this.d8_geometry, this.dice_material);
    }
    
    threeD_dice.create_d9 = function() {
        if (!this.d10_geometry) this.d10_geometry = create_d10_geometry(vars.scale * 0.9);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            create_dice_materials(CONSTS.standart_d20_dice_face_labels, vars.scale / 2, 1.0));
        return new THREE.Mesh(this.d10_geometry, this.dice_material);
    }
    
    threeD_dice.create_d10 = function() {
        if (!this.d10_geometry) this.d10_geometry = create_d10_geometry(vars.scale * 0.9);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            create_dice_materials(CONSTS.standart_d20_dice_face_labels, vars.scale / 2, 1.0));
        return new THREE.Mesh(this.d10_geometry, this.dice_material);
    }
    
    threeD_dice.create_d12 = function() {
        if (!this.d12_geometry) this.d12_geometry = create_d12_geometry(vars.scale * 0.9);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            create_dice_materials(CONSTS.standart_d20_dice_face_labels, vars.scale / 2, 1.0));
        return new THREE.Mesh(this.d12_geometry, this.dice_material);
    }
    
    threeD_dice.create_d20 = function() {
        if (!this.d20_geometry) this.d20_geometry = create_d20_geometry(vars.scale);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            create_dice_materials(CONSTS.standart_d20_dice_face_labels, vars.scale / 2, 1.2));
        return new THREE.Mesh(this.d20_geometry, this.dice_material);
    }
    
    threeD_dice.create_d100 = function() {
        if (!this.d10_geometry) this.d10_geometry = create_d10_geometry(vars.scale * 0.9);
        if (!this.d100_material) this.d100_material = new THREE.MeshFaceMaterial(
            create_dice_materials(CONSTS.standart_d100_dice_face_labels, vars.scale / 2, 1.5));
        return new THREE.Mesh(this.d10_geometry, this.d100_material);
    }
    
    //pinstripes
    function draw_pinstripes(context, size, base_color, stripe_color) {
        context.fillStyle = base_color;
        context.fillRect(0, 0, size, size);
        context.save();
        context.strokeStyle = `${stripe_color}80`;
        context.lineWidth = size * 0.02;
        context.translate(size / 2, size / 2);
        //context.rotate(Math.PI / 4); // 45° pinstripes
        var diag = size * 1.5;
        for (var x = -diag; x < diag; x += size * 0.2) {
            context.beginPath();
            context.moveTo(x, -diag);
            context.lineTo(x, diag);
            context.stroke();
        }
        context.restore();
    }
    
    
    function create_dice_materials(face_labels, size, margin) {
        function create_text_texture(text, color, back_color) {
            if (text == undefined) return null;
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            // Bumped from *2 to *4, and now decoupled from vars.scale via
            // calc_label_resolution (see HELPERS section) so small dice scales
            // don't produce fuzzy low-res label textures.
            var ts = calc_label_resolution(size + size * 2 * margin, 4);
            canvas.width = canvas.height = ts;
            context.font = ts / (1 + 2 * margin) + "pt BaseballClubSolid";
            //context.fillStyle = back_color;
            //context.fillRect(0, 0, canvas.width, canvas.height);
            draw_pinstripes(context, canvas.width, back_color, vars.stripe_color);
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = color;
            context.strokeStyle = vars.outline_color;
            context.lineWidth = Math.max(8, ts / 34); // scales with the resolution above instead of a fixed value
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            if (text == '6' || text == '9') {
                context.fillText('  .', canvas.width / 2, canvas.height / 2);
            }
            var texture = new THREE.Texture(canvas);
            texture.anisotropy = that.renderer_max_anisotropy || 1;
            texture.needsUpdate = true;
            return texture;
        }
        var materials = [];
        for (var i = 0; i < face_labels.length; ++i)
            materials.push(new THREE.MeshPhongMaterial($t.copyto(vars.material_options, { map: create_text_texture(face_labels[i], vars.label_color, vars.dice_color) })));
        return materials;
    }
    
    function create_d4_materials(size, margin, labels) {
        function create_d4_text(text, color, back_color) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            // Bumped from *2 to *4, and decoupled from vars.scale via
            // calc_label_resolution — same fix as create_text_texture.
            var ts = calc_label_resolution(size + margin, 4);
            canvas.width = canvas.height = ts;
            context.font = (ts - margin) * 0.5 + "pt BaseballClubSolid";
            context.fillStyle = back_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = color;
            for (var i in text) {
                context.fillText(text[i], canvas.width / 2,
                    canvas.height / 2 - ts * 0.3);
                context.translate(canvas.width / 2, canvas.height / 2);
                context.rotate(Math.PI * 2 / 3);
                context.translate(-canvas.width / 2, -canvas.height / 2);
            }
            var texture = new THREE.Texture(canvas);
            texture.anisotropy = that.renderer_max_anisotropy || 1;
            texture.needsUpdate = true;
            return texture;
        }
        var materials = [];
        for (var i = 0; i < labels.length; ++i)
            materials.push(new THREE.MeshPhongMaterial($t.copyto(vars.material_options, {
                map: create_d4_text(labels[i], vars.label_color, vars.dice_color)
                
            })));
        return materials;
    }
    
    function create_d4_geometry(radius) {
        var vertices = [
            [1, 1, 1],
            [-1, -1, 1],
            [-1, 1, -1],
            [1, -1, -1]
        ];
        var faces = [
            [1, 0, 2, 1],
            [0, 1, 3, 2],
            [0, 3, 2, 3],
            [1, 2, 3, 4]
        ];
        return create_geom(vertices, faces, radius, -0.1, Math.PI * 7 / 6, 0.96);
    }
    
    function create_d6_geometry(radius) {
        var vertices = [
            [-1, -1, -1],
            [1, -1, -1],
            [1, 1, -1],
            [-1, 1, -1],
            [-1, -1, 1],
            [1, -1, 1],
            [1, 1, 1],
            [-1, 1, 1]
        ];
        var faces = [
            [0, 3, 2, 1, 1],
            [1, 2, 6, 5, 2],
            [0, 1, 5, 4, 3],
            [3, 7, 6, 2, 4],
            [0, 4, 7, 3, 5],
            [4, 5, 6, 7, 6]
        ];
        return create_geom(vertices, faces, radius, 0.1, Math.PI / 4, 0.96);
    }
    
    function create_d8_geometry(radius) {
        var vertices = [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1]
        ];
        var faces = [
            [0, 2, 4, 1],
            [0, 4, 3, 2],
            [0, 3, 5, 3],
            [0, 5, 2, 4],
            [1, 3, 4, 5],
            [1, 4, 2, 6],
            [1, 2, 5, 7],
            [1, 5, 3, 8]
        ];
        return create_geom(vertices, faces, radius, 0, -Math.PI / 4 / 2, 0.965);
    }
    
    function create_d10_geometry(radius) {
        var a = Math.PI * 2 / 10,
            k = Math.cos(a),
            h = 0.105,
            v = -1;
        var vertices = [];
        for (var i = 0, b = 0; i < 10; ++i, b += a)
            vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)]);
        vertices.push([0, 0, -1]);
        vertices.push([0, 0, 1]);
        var faces = [
            [5, 7, 11, 0],
            [4, 2, 10, 1],
            [1, 3, 11, 2],
            [0, 8, 10, 3],
            [7, 9, 11, 4],
            [8, 6, 10, 5],
            [9, 1, 11, 6],
            [2, 0, 10, 7],
            [3, 5, 11, 8],
            [6, 4, 10, 9],
            [1, 0, 2, v],
            [1, 2, 3, v],
            [3, 2, 4, v],
            [3, 4, 5, v],
            [5, 4, 6, v],
            [5, 6, 7, v],
            [7, 6, 8, v],
            [7, 8, 9, v],
            [9, 8, 0, v],
            [9, 0, 1, v]
        ];
        return create_geom(vertices, faces, radius, 0, Math.PI * 6 / 5, 0.945);
    }
    
    function create_d12_geometry(radius) {
        var p = (1 + Math.sqrt(5)) / 2,
            q = 1 / p;
        var vertices = [
            [0, q, p],
            [0, q, -p],
            [0, -q, p],
            [0, -q, -p],
            [p, 0, q],
            [p, 0, -q],
            [-p, 0, q],
            [-p, 0, -q],
            [q, p, 0],
            [q, -p, 0],
            [-q, p, 0],
            [-q, -p, 0],
            [1, 1, 1],
            [1, 1, -1],
            [1, -1, 1],
            [1, -1, -1],
            [-1, 1, 1],
            [-1, 1, -1],
            [-1, -1, 1],
            [-1, -1, -1]
        ];
        var faces = [
            [2, 14, 4, 12, 0, 1],
            [15, 9, 11, 19, 3, 2],
            [16, 10, 17, 7, 6, 3],
            [6, 7, 19, 11, 18, 4],
            [6, 18, 2, 0, 16, 5],
            [18, 11, 9, 14, 2, 6],
            [1, 17, 10, 8, 13, 7],
            [1, 13, 5, 15, 3, 8],
            [13, 8, 12, 4, 5, 9],
            [5, 4, 14, 9, 15, 10],
            [0, 12, 8, 10, 16, 11],
            [3, 19, 7, 17, 1, 12]
        ];
        return create_geom(vertices, faces, radius, 0.2, -Math.PI / 4 / 2, 0.968);
    }
    
    function create_d20_geometry(radius) {
        var t = (1 + Math.sqrt(5)) / 2;
        var vertices = [
            [-1, t, 0],
            [1, t, 0],
            [-1, -t, 0],
            [1, -t, 0],
            [0, -1, t],
            [0, 1, t],
            [0, -1, -t],
            [0, 1, -t],
            [t, 0, -1],
            [t, 0, 1],
            [-t, 0, -1],
            [-t, 0, 1]
        ];
        var faces = [
            [0, 11, 5, 1],
            [0, 5, 1, 2],
            [0, 1, 7, 3],
            [0, 7, 10, 4],
            [0, 10, 11, 5],
            [1, 5, 9, 6],
            [5, 11, 4, 7],
            [11, 10, 2, 8],
            [10, 7, 6, 9],
            [7, 1, 8, 10],
            [3, 9, 4, 11],
            [3, 4, 2, 12],
            [3, 2, 6, 13],
            [3, 6, 8, 14],
            [3, 8, 9, 15],
            [4, 9, 5, 16],
            [2, 4, 11, 17],
            [6, 2, 10, 18],
            [8, 6, 7, 19],
            [9, 8, 1, 20]
        ];
        return create_geom(vertices, faces, radius, -0.2, -Math.PI / 4 / 2, 0.955);
    }
    
    // HELPERS
    
    function rnd() {
        return Math.random();
    }
    
    function create_shape(vertices, faces, radius) {
        var cv = new Array(vertices.length),
            cf = new Array(faces.length);
        for (var i = 0; i < vertices.length; ++i) {
            var v = vertices[i];
            cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
        }
        for (var i = 0; i < faces.length; ++i) {
            cf[i] = faces[i].slice(0, faces[i].length - 1);
        }
        return new CANNON.ConvexPolyhedron(cv, cf);
    }
    
    function make_geom(vertices, faces, radius, tab, af) {
        var geom = new THREE.Geometry();
        for (var i = 0; i < vertices.length; ++i) {
            var vertex = vertices[i].multiplyScalar(radius);
            vertex.index = geom.vertices.push(vertex) - 1;
        }
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i],
                fl = ii.length - 1;
            var aa = Math.PI * 2 / fl;
            for (var j = 0; j < fl - 2; ++j) {
                geom.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
                    geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]
                ], 0, ii[fl] + 1));
                geom.faceVertexUvs[0].push([
                    new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
                    new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
                    new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))
                ]);
            }
        }
        geom.computeFaceNormals();
        geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
        return geom;
    }
    
    function chamfer_geom(vectors, faces, chamfer) {
        var chamfer_vectors = [],
            chamfer_faces = [],
            corner_faces = new Array(vectors.length);
        for (var i = 0; i < vectors.length; ++i) corner_faces[i] = [];
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i],
                fl = ii.length - 1;
            var center_point = new THREE.Vector3();
            var face = new Array(fl);
            for (var j = 0; j < fl; ++j) {
                var vv = vectors[ii[j]].clone();
                center_point.add(vv);
                corner_faces[ii[j]].push(face[j] = chamfer_vectors.push(vv) - 1);
            }
            center_point.divideScalar(fl);
            for (var j = 0; j < fl; ++j) {
                var vv = chamfer_vectors[face[j]];
                vv.subVectors(vv, center_point).multiplyScalar(chamfer).addVectors(vv, center_point);
            }
            face.push(ii[fl]);
            chamfer_faces.push(face);
        }
        for (var i = 0; i < faces.length - 1; ++i) {
            for (var j = i + 1; j < faces.length; ++j) {
                var pairs = [],
                    lastm = -1;
                for (var m = 0; m < faces[i].length - 1; ++m) {
                    var n = faces[j].indexOf(faces[i][m]);
                    if (n >= 0 && n < faces[j].length - 1) {
                        if (lastm >= 0 && m != lastm + 1) pairs.unshift([i, m], [j, n]);
                        else pairs.push([i, m], [j, n]);
                        lastm = m;
                    }
                }
                if (pairs.length != 4) continue;
                chamfer_faces.push([chamfer_faces[pairs[0][0]][pairs[0][1]],
                    chamfer_faces[pairs[1][0]][pairs[1][1]],
                    chamfer_faces[pairs[3][0]][pairs[3][1]],
                    chamfer_faces[pairs[2][0]][pairs[2][1]], -1
                ]);
            }
        }
        for (var i = 0; i < corner_faces.length; ++i) {
            var cf = corner_faces[i],
                face = [cf[0]],
                count = cf.length - 1;
            while (count) {
                for (var m = faces.length; m < chamfer_faces.length; ++m) {
                    var index = chamfer_faces[m].indexOf(face[face.length - 1]);
                    if (index >= 0 && index < 4) {
                        if (--index == -1) index = 3;
                        var next_vertex = chamfer_faces[m][index];
                        if (cf.indexOf(next_vertex) >= 0) {
                            face.push(next_vertex);
                            break;
                        }
                    }
                }
                --count;
            }
            face.push(-1);
            chamfer_faces.push(face);
        }
        return { vectors: chamfer_vectors, faces: chamfer_faces };
    }
    
    function create_geom(vertices, faces, radius, tab, af, chamfer) {
        var vectors = new Array(vertices.length);
        for (var i = 0; i < vertices.length; ++i) {
            vectors[i] = (new THREE.Vector3).fromArray(vertices[i]).normalize();
        }
        var cg = chamfer_geom(vectors, faces, chamfer);
        var geom = make_geom(cg.vectors, cg.faces, radius, tab, af);
        //var geom = make_geom(vectors, faces, radius, tab, af); // Without chamfer
        geom.cannon_shape = create_shape(vectors, faces, radius);
        return geom;
    }
    
    function calc_texture_size(approx) {
        return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
    }
    
    // Face-label canvases were sized proportionally to vars.scale (the dice's
    // world-space size), which has no reliable relationship to how many actual
    // screen pixels a face occupies. On setups where vars.scale ends up small
    // (e.g. ~20), that produced ~64-128px textures that looked fuzzy once
    // magnified by a high devicePixelRatio. This floors the resolution and
    // scales it up for HiDPI screens instead, independent of vars.scale.
    function calc_label_resolution(approx, multiplier) {
        var target = calc_texture_size(approx) * multiplier;
        target = Math.max(target, 256); // floor: never go below a reasonably crisp size
        target *= (window.devicePixelRatio || 1);
        target = Math.min(target, 1024); // cap: avoid excessive texture memory per face
        // Multiplying by a non-integer/odd devicePixelRatio (e.g. 3) can knock
        // the result off power-of-two (256 * 3 = 768). This renderer's texture
        // path requires POT and otherwise silently resizes + warns on every
        // material build, so round up to the nearest POT ourselves instead.
        return Math.pow(2, Math.ceil(Math.log(target) / Math.log(2)));
    }
    
    function make_random_vector(vector) {
        var random_angle = rnd() * Math.PI / 5 - Math.PI / 5 / 2;
        var vec = {
            x: vector.x * Math.cos(random_angle) - vector.y * Math.sin(random_angle),
            y: vector.x * Math.sin(random_angle) + vector.y * Math.cos(random_angle)
        };
        if (vec.x == 0) vec.x = 0.01;
        if (vec.y == 0) vec.y = 0.01;
        return vec;
    }
    
    //determines which face is up after roll animation
    function get_dice_value(dice) {
        var vector = new THREE.Vector3(0, 0, dice.dice_type == 'd4' ? -1 : 1);
        var closest_face, closest_angle = Math.PI * 2;
        for (var i = 0, l = dice.geometry.faces.length; i < l; ++i) {
            var face = dice.geometry.faces[i];
            if (face.materialIndex == 0) continue;
            var angle = face.normal.clone().applyQuaternion(dice.body.quaternion).angleTo(vector);
            if (angle < closest_angle) {
                closest_angle = angle;
                closest_face = face;
            }
        }
        var matindex = closest_face ? closest_face.materialIndex - 1 : -1; //todo: bug thrown here, sometimes closest_face = undefined
        if (dice.dice_type == 'd100') matindex *= 10;
        if (dice.dice_type == 'd10' && matindex == 0) matindex = 10;
        return matindex;
    }
    
    function get_dice_values(dices) {
        var values = [];
        for (var i = 0, l = dices.length; i < l; ++i) {
            values.push(get_dice_value(dices[i]));
        }
        return values;
    }
    
    function shift_dice_faces(dice, value, res) {
        var r = CONSTS.dice_face_range[dice.dice_type];
        if (dice.dice_type == 'd10' && value == 10) value = 0;
        if (!(value >= r[0] && value <= r[1])) return;
        var num = value - res;
        var geom = dice.geometry.clone();
        for (var i = 0, l = geom.faces.length; i < l; ++i) {
            var matindex = geom.faces[i].materialIndex;
            if (matindex == 0) continue;
            matindex += num - 1;
            while (matindex > r[1]) matindex -= r[1];
            while (matindex < r[0]) matindex += r[1];
            geom.faces[i].materialIndex = matindex + 1;
        }
        if (dice.dice_type == 'd4' && num != 0) {
            if (num < 0) num += 4;
            dice.material = new THREE.MeshFaceMaterial(
                create_d4_materials(vars.scale / 2, vars.scale * 2, CONSTS.d4_labels[num]));
        }
        dice.geometry = geom;
    }
    
    //playSound function and audio file copied from 
    //https://github.com/chukwumaijem/roll-a-die
    /*    function playSound(outerContainer, soundVolume) {
            if (soundVolume === 0) return;
            const audio = document.createElement('audio');
            outerContainer.appendChild(audio);
            audio.src = 'assets/nc93322.mp3'; //todo: make this configurable
            audio.volume = soundVolume;
            audio.play();
            audio.onended = () => {
              audio.remove();
            };
        }
    */
    return that;
}());
