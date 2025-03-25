import * as THREE from "three"
class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
}

class SceneData {
    constructor() {
        this.glslVersion = 1
        this.camera = new THREE.OrthographicCamera()
        this.object = new Objects()
        this.objects = []
        this.background = 16448250
        this.materials = []
        this.actions = []
        this.properties = ""
        this.customDepthBufferTexture = false
    }
}

class Objects {
    constructor() {
        this.position = new Vec3(0, 0, 0)
        this.rotation = new Vec3(0, 0, 0)
        this.scale = new Vec3(1, 1, 1)
        this.geometry = h.Plane
        this.model = ""
        this.meshes = []
        this.color = 16777215
    }
}

class he {
    constructor(J) {
        this.speed = 1
        this.pivot = new Vec3(0, 0, 0)
        this.speed = J.speed
        this.pivot = J.pivot
    }
    update(J, re) {
        const ce = re.camera
            , de = ce.position.x - this.pivot.x
            , Ie = ce.position.z - this.pivot.z
            , qe = J * this.speed / 1e3
            , pe = de * Math.cos(qe) + Ie * Math.sin(qe)
            , Be = -de * Math.sin(qe) + Ie * Math.cos(qe);
        ce.position.set(this.pivot.x + pe, ce.position.y, this.pivot.z + Be),
            ce.lookAt(new THREE.Vector3(this.pivot.x, this.pivot.y, this.pivot.z))
    }
}

const G = {
    Gd: {
        "0": "RotateCamera",
        "1": "MoveCamera",
        "RotateCamera": 0,
        "MoveCamera": 1
    },
    so: he,
    NE: {
        "0": "Triangle",
        "1": "Plane",
        "2": "Box",
        "3": "Sphere",
        "4": "SpriteDirectedQuad",
        "5": "SpriteCircle",
        "6": "SpriteCircleQuad",
        "7": "SpriteTriangle",
        "8": "SpriteTriangle2",
        "9": "SpriteIndexedQuad",
        "10": "GLTF",
        "11": "SpriteIndexedQuadDoubleSided",
        "12": "SpriteLine5x512",
        "13": "SpriteLine5x1024",
        "14": "SpriteLine5x2048",
        "15": "SpriteLine10x1",
        "16": "SpriteLine10x1xOneSide",
        "17": "SpriteLine10x512",
        "18": "SpriteLine10x1024",
        "19": "Plane512x512",
        "Triangle": 0,
        "Plane": 1,
        "Box": 2,
        "Sphere": 3,
        "SpriteDirectedQuad": 4,
        "SpriteCircle": 5,
        "SpriteCircleQuad": 6,
        "SpriteTriangle": 7,
        "SpriteTriangle2": 8,
        "SpriteIndexedQuad": 9,
        "GLTF": 10,
        "SpriteIndexedQuadDoubleSided": 11,
        "SpriteLine5x512": 12,
        "SpriteLine5x1024": 13,
        "SpriteLine5x2048": 14,
        "SpriteLine10x1": 15,
        "SpriteLine10x1xOneSide": 16,
        "SpriteLine10x512": 17,
        "SpriteLine10x1024": 18,
        "Plane512x512": 19
    }
}

class createScene {
    createScene(sceneSettings) {
        const scene = new THREE.Scene;
        scene.background = new THREE.Color(sceneSettings.background)
        return scene
    }
    createCamera(sceneSettings, canvas_width, canvas_height) {
        let camera = null;
        if (sceneSettings.isOrthographic) {
            camera = new THREE.OrthographicCamera(sceneSettings.left, sceneSettings.right, sceneSettings.top, sceneSettings.bottom, sceneSettings.near, sceneSettings.far)
        } else {
            camera = new THREE.PerspectiveCamera(sceneSettings.fov, canvas_width / canvas_height, sceneSettings.near, sceneSettings.far)
        }
        camera.position.set(sceneSettings.position.x, sceneSettings.position.y, sceneSettings.position.z)
        camera.rotateY(sceneSettings.rotation.y)
        camera.rotateX(sceneSettings.rotation.x)
        camera.rotateZ(sceneSettings.rotation.z)
        return camera
    }
    createScreenQuad(q) {
        const object3d = new THREE.Object3D()
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), q);
        object3d.add(mesh)
        return object3d
    }
    createObject(geometryIndex, sceneSettings, he, meshes, U) {
        var self = this;
        return (0,
            s.Z)(function* () {
                if (sceneSettings.geometry == G.Ne.GLTF) {
                    if (!he)
                        return [];
                    const qe = new Vec3.E;
                    try {
                        const pe = yield qe.parseAsync(he, "");
                        pe.scene.traverse(ye => {
                            if (ye.isMesh) {
                                const Oe = ye;
                                self.setGeometryId(Oe.geometry, geometryIndex);
                                const it = Oe.material.color;
                                it && self.setGeometryColor2(Oe.geometry, it.r, it.g, it.b, 1);
                                const Ue = (meshes || []).find(lt => lt.name.toLowerCase() == ye.name.toLowerCase());
                                Oe.material = Ue && U[Ue.materialId] ? U[Ue.materialId] : U[0]
                            }
                        }
                        );
                        const Be = new THREE.Object3D();
                        return Be.rotateY(sceneSettings.rotation.y),
                            Be.rotateX(sceneSettings.rotation.x),
                            Be.rotateZ(sceneSettings.rotation.z),
                            Be.scale.set(sceneSettings.scale.x, sceneSettings.scale.y, sceneSettings.scale.z),
                            Be.position.set(sceneSettings.position.x, sceneSettings.position.y, sceneSettings.position.z),
                            Be.add(pe.scene),
                            [Be]
                    } catch (pe) {
                        return console.log(pe),
                            []
                    }
                }
                const re = (meshes || []).find(qe => "main" == qe.name.toLowerCase())?.materialId
                    , ce = U[re || 0]
                    , de = self.createBufferGeometry(Number.parseInt(sceneSettings.geometry));
                de.computeVertexNormals(),
                    self.setGeometryColor(de, sceneSettings.color),
                    self.setGeometryId(de, geometryIndex);
                const Ie = new THREE.Mesh(de, ce);
                return Ie.rotateY(sceneSettings.rotation.y),
                    Ie.rotateX(sceneSettings.rotation.x),
                    Ie.rotateZ(sceneSettings.rotation.z),
                    Ie.scale.set(sceneSettings.scale.x, sceneSettings.scale.y, sceneSettings.scale.z),
                    Ie.position.set(sceneSettings.position.x, sceneSettings.position.y, sceneSettings.position.z),
                    [Ie]
            })()
    }
    createBufferGeometry(index_value) {
        if (index_value == G.Ne.Triangle) {
            var $ = new Float32Array([-.5, -.5, 0, .5, -.5, 0, 0, .5, 0])
                , he = new Float32Array([0, 0, 1, 0, .5, 1]);
            return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute($, 3)),
                W.setAttribute("uv", new THREE.BufferAttribute(he, 2)),
                W
        }
        if (index_value == G.Ne.SpriteCircle) {
            const ce = []
                , de = []
                , Ie = []
                , qe = [];
            for (let it = 0; it < 10; it++) {
                const Ue = .75 * Math.cos(.628 * it)
                    , lt = .75 * Math.sin(.628 * it)
                    , _t = 0;
                if (ce.push(Ue, lt, _t),
                    ce.push(Ue, lt, _t),
                    it % 2 == 0 ? (de.push(0, 0),
                        de.push(1, 0)) : (de.push(0, 1),
                            de.push(1, 1)),
                    Ie.push(Ie.length),
                    Ie.push(Ie.length),
                    it > 0) {
                    const Lt = 2 * (it - 1);
                    qe.push(Lt + 0, Lt + 1, Lt + 2),
                        qe.push(Lt + 3, Lt + 2, Lt + 1)
                }
            }
            const pe = 18;
            qe.push(pe + 0, pe + 1, 0),
                qe.push(1, 0, pe + 1);
            const Be = []
                , ye = [];
            for (let it = 0; it < 20; it += 2) {
                if (it > 0) {
                    const Ue = ce[3 * (it - 2) + 0]
                        , lt = ce[3 * (it - 2) + 1]
                        , _t = ce[3 * (it - 2) + 2];
                    Be.push(Ue, lt, _t),
                        Be.push(Ue, lt, _t)
                } else {
                    const Ue = ce[54]
                        , lt = ce[55]
                        , _t = ce[56];
                    Be.push(Ue, lt, _t),
                        Be.push(Ue, lt, _t)
                }
                if (it < 18) {
                    const Ue = ce[3 * (it + 2) + 0]
                        , lt = ce[3 * (it + 2) + 1]
                        , _t = ce[3 * (it + 2) + 2];
                    ye.push(Ue, lt, _t),
                        ye.push(Ue, lt, _t)
                } else {
                    const Ue = ce[0]
                        , lt = ce[1]
                        , _t = ce[2];
                    ye.push(Ue, lt, _t),
                        ye.push(Ue, lt, _t)
                }
            }
            return (W = new THREE.BufferGeometry()).setIndex(qe),
                W.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ce), 3)),
                W.setAttribute("prevPosition", new THREE.BufferAttribute(new Float32Array(Be), 3)),
                W.setAttribute("nextPosition", new THREE.BufferAttribute(new Float32Array(ye), 3)),
                W.setAttribute("index", new THREE.BufferAttribute(new Int32Array(Ie), 1)),
                W.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(de), 2)),
                W
        }
        if (index_value == G.Ne.SpriteCircleQuad) {
            const ce = [];
            for (let Ue = 0; Ue < 10; Ue++) {
                const lt = .75 * Math.cos(.628 * Ue)
                    , _t = .75 * Math.sin(.628 * Ue);
                ce.push({
                    x: lt,
                    y: _t,
                    z: 0
                })
            }
            const de = []
                , Ie = []
                , qe = []
                , pe = []
                , Be = []
                , ye = []
                , Oe = [];
            for (let Ue = 0; Ue < 10; Ue++) {
                const kt = ce[Ue]
                    , wn = ce[(Ue + 1) % 10]
                    , yt = ce[(Ue + 2) % 10];
                Ie.push(kt.x, kt.y, kt.z),
                    de.push(wn.x, wn.y, wn.z),
                    qe.push(kt.x, kt.y, kt.z),
                    Ie.push(kt.x, kt.y, kt.z),
                    de.push(wn.x, wn.y, wn.z),
                    qe.push(kt.x, kt.y, kt.z),
                    Ie.push(kt.x, kt.y, kt.z),
                    de.push(wn.x, wn.y, wn.z),
                    qe.push(yt.x, yt.y, yt.z),
                    Ie.push(kt.x, kt.y, kt.z),
                    de.push(wn.x, wn.y, wn.z),
                    qe.push(yt.x, yt.y, yt.z),
                    Be.push(0),
                    Be.push(1),
                    Be.push(2),
                    Be.push(3),
                    ye.push(-.5, -.5),
                    ye.push(-.5, .5),
                    ye.push(.5, -.5),
                    ye.push(.5, .5),
                    pe.push(0, 0),
                    pe.push(0, 1),
                    pe.push(1, 0),
                    pe.push(1, 1);
                const hn = 4 * Ue;
                Oe.push(hn + 0, hn + 2, hn + 1),
                    Oe.push(hn + 3, hn + 1, hn + 2)
            }
            return (W = new THREE.BufferGeometry()).setIndex(Oe),
                W.setAttribute("position", new THREE.BufferAttribute(new Float32Array(de), 3)),
                W.setAttribute("prevPosition", new THREE.BufferAttribute(new Float32Array(Ie), 3)),
                W.setAttribute("nextPosition", new THREE.BufferAttribute(new Float32Array(qe), 3)),
                W.setAttribute("index", new THREE.BufferAttribute(new Int32Array(Be), 1)),
                W.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(pe), 2)),
                W.setAttribute("dudv", new THREE.BufferAttribute(new Float32Array(ye), 2)),
                W
        }
        if (index_value == G.Ne.SpriteTriangle) {
            const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])
                , J = new Int32Array([0, 1, 2, 3, 4, 5])
                , re = new Float32Array([0, 0, 1, 0, .5, 1]);
            return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute(U, 3)),
                W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
                W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
                W
        }
        if (index_value == G.Ne.SpriteTriangle2) {
            const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                , J = new Int32Array([0, 1, 2, 3, 4, 5])
                , re = new Float32Array([0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1]);
            return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute(U, 3)),
                W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
                W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
                W
        }
        if (index_value == G.Ne.SpriteIndexedQuad) {
            const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                , J = new Int32Array([0, 1, 2, 3])
                , re = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
                , ce = [0, 1, 2, 2, 3, 0];
            return (W = new THREE.BufferGeometry()).setIndex(ce),
                W.setAttribute("position", new THREE.BufferAttribute(U, 3)),
                W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
                W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
                W
        }
        if (index_value == G.Ne.SpriteIndexedQuadDoubleSided) {
            const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                , J = new Int32Array([0, 1, 2, 3])
                , re = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
                , ce = [0, 1, 2, 2, 3, 0, 2, 1, 0, 0, 3, 2];
            return (W = new THREE.BufferGeometry()).setIndex(ce),
                W.setAttribute("position", new THREE.BufferAttribute(U, 3)),
                W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
                W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
                W
        }
        if (index_value == G.Ne.SpriteDirectedQuad) {
            const U = new Float32Array([-.5, -.7, 0, -.5, -.7, 0, .5, .7, 0, .5, .7, 0])
                , J = new Float32Array([.5, .7, 0, .5, .7, 0, -.5, -.7, 0, -.5, -.7, 0])
                , re = new Int32Array([0, 1, 2, 3])
                , ce = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
                , de = [0, 1, 2, 2, 3, 0];
            var W;
            return (W = new THREE.BufferGeometry()).setIndex(de),
                W.setAttribute("position", new THREE.BufferAttribute(U, 3)),
                W.setAttribute("nextPosition", new THREE.BufferAttribute(J, 3)),
                W.setAttribute("index", new THREE.BufferAttribute(re, 1)),
                W.setAttribute("uv", new THREE.BufferAttribute(ce, 2)),
                W
        }
        if (index_value == G.Ne.SpriteLine5x512)
            return this.createLines(5, 512);
        if (index_value == G.Ne.SpriteLine5x1024)
            return this.createLines(5, 1024);
        if (index_value == G.Ne.SpriteLine5x2048)
            return this.createLines(5, 2048);
        if (index_value == G.Ne.SpriteLine10x1xOneSide)
            return this.createLines(10, 1, false);
        if (index_value == G.Ne.SpriteLine10x1)
            return this.createLines(10, 1);
        if (index_value == G.Ne.SpriteLine10x512)
            return this.createLines(10, 512);
        if (index_value == G.Ne.SpriteLine10x1024)
            return this.createLines(10, 1024);
        switch (index_value) {
            case G.Ne.Plane:
                return new THREE.PlaneGeometry(1, 1);
            case G.Ne.Plane512x512:
                return new THREE.PlaneGeometry(1, 1, 512, 512);
            case G.Ne.Box:
                return new THREE.BoxGeometry(1, 1, 1, 1);
            case G.Ne.Sphere:
                return new THREE.SphereGeometry(.5, 32, 32);
            default:
                return new THREE.PlaneGeometry(1, 1)
        }
    }
    createLines(q, $, he = true) {
        let W = []
            , U = []
            , J = [];
        for (let ce = 0; ce < $; ce++) {
            let de = ce * (q * (he ? 4 : 2));
            for (let Ie = 0; Ie < q; Ie++)
                W.push(2 * Ie + 0 + de),
                    W.push(2 * Ie + 1 + de),
                    J.push(0, 0, 0),
                    J.push(0, 0, 0),
                    0 != Ie && (U.push(2 * (Ie - 1) + 0 + de),
                        U.push(2 * (Ie - 1) + 1 + de),
                        U.push(2 * (Ie - 1) + 2 + de),
                        U.push(2 * (Ie - 1) + 2 + de),
                        U.push(2 * (Ie - 1) + 1 + de),
                        U.push(2 * (Ie - 1) + 3 + de));
            for (let Ie = q; he && Ie < 2 * q; Ie++)
                W.push(2 * Ie + 0 + de),
                    W.push(2 * Ie + 1 + de),
                    J.push(0, 0, 0),
                    J.push(0, 0, 0),
                    Ie != q && (U.push(2 * (Ie - 1) + 2 + de),
                        U.push(2 * (Ie - 1) + 1 + de),
                        U.push(2 * (Ie - 1) + 0 + de),
                        U.push(2 * (Ie - 1) + 3 + de),
                        U.push(2 * (Ie - 1) + 1 + de),
                        U.push(2 * (Ie - 1) + 2 + de))
        }
        var re = new THREE.BufferGeometry();
        return re.setIndex(U),
            re.setAttribute("position", new THREE.BufferAttribute(new Float32Array(J), 3)),
            re.setAttribute("index", new THREE.BufferAttribute(new Int32Array(W), 1)),
            re
    }
    setGeometryColor(q, $) {
        const he = q.getAttribute("position")
            , W = []
            , U = new THREE.Color($);
        for (let J = 0; J < he.count; J += 3)
            W.push(U.r, U.g, U.b, 1),
                W.push(U.r, U.g, U.b, 1),
                W.push(U.r, U.g, U.b, 1);
        q.setAttribute("color", new THREE.Float32BufferAttribute(W, 4))
    }
    setGeometryColor2(q, $, he, W, U) {
        const J = q.getAttribute("position")
            , re = [];
        for (let ce = 0; ce < J.count; ce++)
            re.push($, he, W, U);
        q.setAttribute("color", new THREE.Float32BufferAttribute(re, 4))
    }
    setGeometryId(q, $) {
        const he = q.getAttribute("position")
            , W = [];
        for (let U = 0; U < he.count; U++)
            W.push($);
        q.setAttribute("id", new THREE.Int32BufferAttribute(W, 1))
    }
    createMaterial(q, $, he, W, U, J, re = "") {
        const ce = (U || []).reduce((pe, Be, ye) => ({
            ...pe,
            [`iChannel${ye}`]: {
                value: Be
            }
        }), {})
            , de = (U || []).reduce((pe, Be, ye) => ({
                ...pe,
                [`iChannelSize${ye}`]: {
                    value: new THREE.Vector2(Be?.image.width, Be?.image.height)
                }
            }), {});
        3 == q && ($ = `\nprecision highp float;\nprecision highp int;\n\n${$}`,
            he = `\nprecision highp float;\nprecision highp int;\n\n${he}`);
        const Ie = {
            glslVersion: 3 == q ? THREE.GLSL3 : THREE.GLSL1,
            uniforms: {
                iResolution: {
                    value: W
                },
                ...ce,
                ...de,
                iTime: {
                    value: J
                },
                viewMatrix: {
                    value: null
                },
                projectionMatrix: {
                    value: null
                },
                inverseProjectionMatrix: {
                    value: null
                },
                inverseViewMatrix: {
                    value: null
                },
                iDepthBuffer: {
                    value: null
                },
                iDepthBufferSize: {
                    value: new THREE.Vector2
                },
                iDepthPass: {
                    value: false
                },
                iRTBuffer0: {
                    value: null
                },
                iRTBuffer1: {
                    value: null
                },
                iRTBuffer2: {
                    value: null
                }
            },
            vertexShader: $,
            fragmentShader: he,
            transparent: true
        }
            , qe = 3 == q ? new THREE.RawShaderMaterial(Ie) : new THREE.ShaderMaterial(Ie);
        return (re || "").trim().split("\n").forEach(pe => {
            const Be = pe.split("#")[0].trim();
            if (Be) {
                const [ye, Oe] = Be.split("=").map(it => it.trim());
                if (ye && void 0 !== Oe && (ye.toLowerCase() == "DepthWrite".toLowerCase() && (qe.depthWrite = "true" == Oe.toLowerCase() || "1" == Oe.toLowerCase()),
                    ye.toLowerCase() == "DepthTest".toLowerCase() && (qe.depthTest = "true" == Oe.toLowerCase() || "1" == Oe.toLowerCase()),
                    ye.toLowerCase() == "Blending".toLowerCase()))
                    switch (Oe.toUpperCase()) {
                        case "BLENDING.NO":
                            qe.blending = 0;
                            break;
                        case "BLENDING.ALPHA":
                            qe.blending = 1;
                            break;
                        case "BLENDING.ADDITIVE":
                            qe.blending = 2;
                            break;
                        case "BLENDING.SUBTRACTIVE":
                            qe.blending = 3;
                            break;
                        case "BLENDING.MULTIPLY":
                            qe.blending = 4
                    }
            }
        }
        ),
            3 == q && qe.blending == 0 && (qe.transparent = false),
            qe
    }
    createActions(q) {
        return (q || []).map(he => {
            switch (he.type) {
                case G.Gd.RotateCamera:
                    return new G.so(he);
                case G.Gd.MoveCamera:
                    return new G.wu(he)
            }
        }
        )
    }
    createRenderTarget(q, $, he = "") {
        let W = 1;
        const U = [{
            format: 1023,
            type: 1009
        }, {
            format: 1023,
            type: 1009
        }, {
            format: 1023,
            type: 1009
        }];
        (he || "").trim().split("\n").forEach(ce => {
            const de = ce.split("#")[0].trim();
            if (de) {
                const [Ie, qe] = de.split("=").map(pe => pe.trim());
                if (Ie && void 0 !== qe) {
                    Ie.toLowerCase() == "RenderTargetsNumber".toLowerCase() && (W = Math.min(Math.max(Number.parseInt(qe) || 1, 1), 3));
                    for (let index = 0; index < 3; index++) {
                        if (Ie.toLowerCase() == `RenderTarget[${index}].pixelFormat`.toLowerCase())
                            switch (qe.toUpperCase()) {
                                case "PIXEL_FORMAT.RED":
                                    U[index].format = 1028;
                                    break;
                                case "PIXEL_FORMAT.RGBA":
                                    U[index].format = 1023
                            }
                        if (Ie.toLowerCase() == `RenderTarget[${index}].dataType`.toLowerCase())
                            switch (qe.toUpperCase()) {
                                case "DATA_TYPE.UNSIGNED_BYTE":
                                    U[index].type = 1009;
                                    break;
                                case "DATA_TYPE.FLOAT":
                                    U[index].type = 1015
                            }
                    }
                }
            }
        }
        );
        const J = new THREE.DepthTexture(q, $)
            , re = new THREE.WebGLMultipleRenderTargets(q, $, W, {
                depthBuffer: true,
                depthTexture: J,
                generateMipmaps: false
            });
        for (let index = 0; index < W; index++)
            re.texture[index].type = U[index].type,
                re.texture[index].format = U[index].format;
        return {
            renderTargets: re,
            depthTexture: J
        }
    }
}