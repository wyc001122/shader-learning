import * as THREE from 'three';
class F {
    constructor(J = 0, re = 0, ce = 0) {
        this.x = J,
            this.y = re,
            this.z = ce
    }
}


const s_Fs = h => -(Math.cos(Math.PI * h) - 1) / 2

class W {
    constructor(J) {
        this.time = 1e3,
            this.distance = new F(0, 0, 0),
            this.pivot = new F(0, 0, 0),
            this.elapsedTime = 0,
            this.startPos = new F(0, 0, 0),
            this.endPos = new F(0, 0, 0),
            this.dir = 1,
            this.woken = !1,
            this.time = J.time,
            this.distance = J.distance,
            this.pivot = J.pivot
    }
    update(J, re) {
        const ce = re.camera;
        this.woken || (this.startPos = new F(ce.position.x, ce.position.y, ce.position.z),
            this.endPos = new F(ce.position.x + this.distance.x, ce.position.y + this.distance.y, ce.position.z + +this.distance.z),
            this.woken = !0),
            this.elapsedTime > this.time && (this.dir = 1 != this.dir ? 1 : -1,
                this.elapsedTime %= this.time),
            this.elapsedTime += J;
        let de = Math.min(1, this.elapsedTime / this.time);
        this.move(ce, 1 == this.dir ? this.startPos : this.endPos, 1 == this.dir ? this.endPos : this.startPos, (0,
            s_Fs)(de)),
            ce.lookAt(new THREE.Vector3(this.pivot.x, this.pivot.y, this.pivot.z))
    }
    move(J, re, ce, de) {
        return 0 == de ? (J.position.x = re.x,
            J.position.y = re.y,
            void (J.position.z = re.z)) : 1 == de ? (J.position.x = ce.x,
                J.position.y = ce.y,
                void (J.position.z = ce.z)) : (J.position.x = re.x + (ce.x - re.x) * de,
                    J.position.y = re.y + (ce.y - re.y) * de,
                    void (J.position.z = re.z + (ce.z - re.z) * de))
    }
}

class he {
    constructor(J) {
        this.speed = 1,
            this.pivot = new F(0, 0, 0),
            this.speed = J.speed,
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
    Ne: {
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
    },
    so: he,
    wu: W
}


export function createBufferGeometry(index_value) {
    if (index_value == G.Ne.Triangle) {
        const $ = new Float32Array([-.5, -.5, 0, .5, -.5, 0, 0, .5, 0])
        const he = new Float32Array([0, 0, 1, 0, .5, 1]);
        return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute($, 3)),
            W.setAttribute("uv", new THREE.BufferAttribute(he, 2)),
            W
    }
    if (index_value == G.Ne.SpriteCircle) {
        const ce = []
        const de = []
        const Ie = []
        const qe = [];
        for (let it = 0; it < 10; it++) {
            const Ue = .75 * Math.cos(.628 * it)
            const lt = .75 * Math.sin(.628 * it)
            const _t = 0;
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
        const ye = [];
        for (let it = 0; it < 20; it += 2) {
            if (it > 0) {
                const Ue = ce[3 * (it - 2) + 0]
                const lt = ce[3 * (it - 2) + 1]
                const _t = ce[3 * (it - 2) + 2];
                Be.push(Ue, lt, _t),
                    Be.push(Ue, lt, _t)
            } else {
                const Ue = ce[54]
                const lt = ce[55]
                const _t = ce[56];
                Be.push(Ue, lt, _t),
                    Be.push(Ue, lt, _t)
            }
            if (it < 18) {
                const Ue = ce[3 * (it + 2) + 0]
                const lt = ce[3 * (it + 2) + 1]
                const _t = ce[3 * (it + 2) + 2];
                ye.push(Ue, lt, _t),
                    ye.push(Ue, lt, _t)
            } else {
                const Ue = ce[0]
                const lt = ce[1]
                const _t = ce[2];
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
            const _t = .75 * Math.sin(.628 * Ue);
            ce.push({
                x: lt,
                y: _t,
                z: 0
            })
        }
        const de = []
        const Ie = []
        const qe = []
        const pe = []
        const Be = []
        const ye = []
        const Oe = [];
        for (let Ue = 0; Ue < 10; Ue++) {
            const kt = ce[Ue]
            const wn = ce[(Ue + 1) % 10]
            const yt = ce[(Ue + 2) % 10];
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
        const J = new Int32Array([0, 1, 2, 3, 4, 5])
        const re = new Float32Array([0, 0, 1, 0, .5, 1]);
        return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute(U, 3)),
            W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
            W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
            W
    }
    if (index_value == G.Ne.SpriteTriangle2) {
        const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        const J = new Int32Array([0, 1, 2, 3, 4, 5])
        const re = new Float32Array([0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1]);
        return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute(U, 3)),
            W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
            W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
            W
    }
    if (index_value == G.Ne.SpriteIndexedQuad) {
        const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        const J = new Int32Array([0, 1, 2, 3])
        const re = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
        const ce = [0, 1, 2, 2, 3, 0];
        return (W = new THREE.BufferGeometry()).setIndex(ce),
            W.setAttribute("position", new THREE.BufferAttribute(U, 3)),
            W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
            W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
            W
    }
    if (index_value == G.Ne.SpriteIndexedQuadDoubleSided) {
        const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        const J = new Int32Array([0, 1, 2, 3])
        const re = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
        const ce = [0, 1, 2, 2, 3, 0, 2, 1, 0, 0, 3, 2];
        return (W = new THREE.BufferGeometry()).setIndex(ce),
            W.setAttribute("position", new THREE.BufferAttribute(U, 3)),
            W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
            W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
            W
    }
    if (index_value == G.Ne.SpriteDirectedQuad) {
        const U = new Float32Array([-.5, -.7, 0, -.5, -.7, 0, .5, .7, 0, .5, .7, 0])
        const J = new Float32Array([.5, .7, 0, .5, .7, 0, -.5, -.7, 0, -.5, -.7, 0])
        const re = new Int32Array([0, 1, 2, 3])
        const ce = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
        const de = [0, 1, 2, 2, 3, 0];
        var W;
        return (W = new THREE.BufferGeometry()).setIndex(de),
            W.setAttribute("position", new THREE.BufferAttribute(U, 3)),
            W.setAttribute("nextPosition", new THREE.BufferAttribute(J, 3)),
            W.setAttribute("index", new THREE.BufferAttribute(re, 1)),
            W.setAttribute("uv", new THREE.BufferAttribute(ce, 2)),
            W
    }
    if (index_value == G.Ne.SpriteLine5x512)
        return createLines(5, 512);
    if (index_value == G.Ne.SpriteLine5x1024)
        return createLines(5, 1024);
    if (index_value == G.Ne.SpriteLine5x2048)
        return createLines(5, 2048);
    if (index_value == G.Ne.SpriteLine10x1xOneSide)
        return createLines(10, 1, false);
    if (index_value == G.Ne.SpriteLine10x1)
        return createLines(10, 1);
    if (index_value == G.Ne.SpriteLine10x512)
        return createLines(10, 512);
    if (index_value == G.Ne.SpriteLine10x1024)
        return createLines(10, 1024);
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

export function createLines(q, $, he = true) {
    let W = []
    const U = []
    const J = [];
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

export function createActions(q) {
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


export function setGeometryColor(q, color) {
    const he = q.getAttribute("position")
        , W = []
        , U = new THREE.Color(color);
    for (let J = 0; J < he.count; J += 3)
        W.push(U.r, U.g, U.b, 1),
            W.push(U.r, U.g, U.b, 1),
            W.push(U.r, U.g, U.b, 1);
    q.setAttribute("color", new THREE.Float32BufferAttribute(W, 4))
}

export function createMaterial(q, vertexShaderCode, fragmentShaderCode, resolution, textures, time, additionalConfig = "") {
    // 处理纹理相关的uniform数据，生成iChannel系列
    const generateTextureUniforms = (texturesArray) => {
        return (texturesArray || []).reduce((previous, texture, index) => ({
            ...previous,
            [`iChannel${index}`]: {
                value: texture
            }
        }), {});
    };
    const textureUniforms = generateTextureUniforms(textures);

    // 处理纹理尺寸相关的uniform数据，生成iChannelSize系列
    const generateTextureSizeUniforms = (texturesArray) => {
        return (texturesArray || []).reduce((previous, texture, index) => ({
            ...previous,
            [`iChannelSize${index}`]: {
                value: new THREE.Vector2(texture?.image.width, texture?.image.height)
            }
        }), {});
    };
    const textureSizeUniforms = generateTextureSizeUniforms(textures);

    // 如果q为3，对顶点和片段着色器代码添加精度声明
    if (q === 3) {
        vertexShaderCode = `\nprecision highp float;\nprecision highp int;\n\n${vertexShaderCode}`;
        fragmentShaderCode = `\nprecision highp float;\nprecision highp int;\n\n${fragmentShaderCode}`;
    }

    // 创建材质的统一配置对象
    const materialConfiguration = {
        glslVersion: q === 3 ? THREE.GLSL3 : THREE.GLSL1,
        uniforms: {
            iResolution: {
                value: resolution
            },
            ...textureUniforms,
            ...textureSizeUniforms,
            iTime: {
                value: time
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
        vertexShader: vertexShaderCode,
        fragmentShader: fragmentShaderCode,
        transparent: true
    };

    // 根据q的值选择创建不同类型的材质
    const createMaterialInstance = (config) => {
        return q === 3 ? new THREE.RawShaderMaterial(config) : new THREE.ShaderMaterial(config);
    };
    const material = createMaterialInstance(materialConfiguration);

    // 处理额外配置字符串，设置材质的相关属性
    const processAdditionalConfig = (configString, mat) => {
        (configString || "").trim().split("\n").forEach(line => {
            const cleanLine = line.split("#")[0].trim();
            if (cleanLine) {
                const [key, value] = cleanLine.split("=").map(str => str.trim());
                if (key && typeof value !== 'undefined') {
                    if (key.toLowerCase() === "DepthWrite".toLowerCase()) {
                        mat.depthWrite = value.toLowerCase() === "true" || value === "1";
                    } else if (key.toLowerCase() === "DepthTest".toLowerCase()) {
                        mat.depthTest = value.toLowerCase() === "true" || value === "1";
                    } else if (key.toLowerCase() === "Blending".toLowerCase()) {
                        switch (value.toUpperCase()) {
                            case "BLENDING.NO":
                                mat.blending = 0;
                                break;
                            case "BLENDING.ALPHA":
                                mat.blending = 1;
                                break;
                            case "BLENDING.ADDITIVE":
                                mat.blending = 2;
                                break;
                            case "BLENDING.SUBTRACTIVE":
                                mat.blending = 3;
                                break;
                            case "BLENDING.MULTIPLY":
                                mat.blending = 4;
                        }
                    }
                }
            }
        });
        if (q === 3 && mat.blending === 0) {
            mat.transparent = false;
        }
        return mat;
    };

    return processAdditionalConfig(additionalConfig, material);
}


export function setGeometryId(q, $) {
    const he = q.getAttribute("position")
        , W = [];
    for (let U = 0; U < he.count; U++)
        W.push($);
    q.setAttribute("id", new THREE.Int32BufferAttribute(W, 1))
}

export function setGeometryColor2(q, $, he, W, U) {
    const J = q.getAttribute("position")
        , re = [];
    for (let ce = 0; ce < J.count; ce++)
        re.push($, he, W, U);
    q.setAttribute("color", new THREE.Float32BufferAttribute(re, 4))
}