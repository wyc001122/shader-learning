
const Ne = {
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


function createObject(my_index, my_objects, my_model, my_meshes, my_materials) {
    var J = this;
    return (0, s.Z)(function* () {
        if (my_objects.geometry == Ne.GLTF) {
            if (!my_model)
                return [];
            const qe = new F.E;
            try {
                const pe = yield qe.parseAsync(my_model, "");
                pe.scene.traverse(ye => {
                    if (ye.isMesh) {
                        const Oe = ye;
                        J.setGeometryId(Oe.geometry, my_index);
                        const it = Oe.material.color;
                        it && J.setGeometryColor2(Oe.geometry, it.r, it.g, it.b, 1);
                        const Ue = (my_meshes || []).find(lt => lt.name.toLowerCase() == ye.name.toLowerCase());
                        Oe.material = Ue && my_materials[Ue.materialId] ? my_materials[Ue.materialId] : my_materials[0]
                    }
                }
                );
                const Be = new C.Tme;
                return Be.rotateY(my_objects.rotation.y),
                    Be.rotateX(my_objects.rotation.x),
                    Be.rotateZ(my_objects.rotation.z),
                    Be.scale.set(my_objects.scale.x, my_objects.scale.y, my_objects.scale.z),
                    Be.position.set(my_objects.position.x, my_objects.position.y, my_objects.position.z),
                    Be.add(pe.scene),
                    [Be]
            } catch (pe) {
                return console.log(pe),
                    []
            }
        }
        const re = (my_meshes || []).find(qe => "main" == qe.name.toLowerCase())?.materialId
            , ce = my_materials[re || 0]
            , de = J.createBufferGeometry(Number.parseInt(my_objects.geometry));
        de.computeVertexNormals(),
            J.setGeometryColor(de, my_objects.color),
            J.setGeometryId(de, my_index);
        const Ie = new C.Kj0(de, ce);
        return Ie.rotateY(my_objects.rotation.y),
            Ie.rotateX(my_objects.rotation.x),
            Ie.rotateZ(my_objects.rotation.z),
            Ie.scale.set(my_objects.scale.x, my_objects.scale.y, my_objects.scale.z),
            Ie.position.set(my_objects.position.x, my_objects.position.y, my_objects.position.z),
            [Ie]
    })()
}

// Ne.Triangle   0
// Ne.SpriteCircle   5
// Ne.SpriteCircleQuad   6 
// Ne.SpriteTriangle  7
// Ne.SpriteTriangle2  8 
// Ne.SpriteIndexedQuad  9 
// Ne.SpriteIndexedQuadDoubleSided  11
// Ne.SpriteDirectedQuad  4
// Ne.SpriteLine5x512  12 
// Ne.SpriteLine5x1024  13 
// Ne.SpriteLine5x2048  14 
// Ne.SpriteLine10x1xOneSide  146


function createBufferGeometry(geometryValue) {
    if (geometryValue == Ne.Triangle) {
        var $ = new Float32Array([-.5, -.5, 0, .5, -.5, 0, 0, .5, 0])
            , he = new Float32Array([0, 0, 1, 0, .5, 1]);
        return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute($, 3)),
            W.setAttribute("uv", new THREE.BufferAttribute(he, 2)),
            W
    }
    if (geometryValue == Ne.SpriteCircle) {
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
    if (geometryValue == Ne.SpriteCircleQuad) {
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
    if (geometryValue == Ne.SpriteTriangle) {
        const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])
            , J = new Int32Array([0, 1, 2, 3, 4, 5])
            , re = new Float32Array([0, 0, 1, 0, .5, 1]);
        return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute(U, 3)),
            W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
            W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
            W
    }
    if (geometryValue == Ne.SpriteTriangle2) {
        const U = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            , J = new Int32Array([0, 1, 2, 3, 4, 5])
            , re = new Float32Array([0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1]);
        return (W = new THREE.BufferGeometry()).setAttribute("position", new THREE.BufferAttribute(U, 3)),
            W.setAttribute("index", new THREE.BufferAttribute(J, 1)),
            W.setAttribute("uv", new THREE.BufferAttribute(re, 2)),
            W
    }
    if (geometryValue == Ne.SpriteIndexedQuad) {
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
    if (geometryValue == Ne.SpriteIndexedQuadDoubleSided) {
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
    if (geometryValue == Ne.SpriteDirectedQuad) {
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
    if (geometryValue == Ne.SpriteLine5x512)
        return this.createLines(5, 512);
    if (geometryValue == Ne.SpriteLine5x1024)
        return this.createLines(5, 1024);
    if (geometryValue == Ne.SpriteLine5x2048)
        return this.createLines(5, 2048);
    if (geometryValue == Ne.SpriteLine10x1xOneSide)
        return this.createLines(10, 1, !1);
    if (geometryValue == Ne.SpriteLine10x1)
        return this.createLines(10, 1);
    if (geometryValue == Ne.SpriteLine10x512)
        return this.createLines(10, 512);
    if (geometryValue == Ne.SpriteLine10x1024)
        return this.createLines(10, 1024);


    switch (geometryValue) {
        case Ne.Plane:
            return new C._12(1, 1);
        case Ne.Plane512x512:
            return new C._12(1, 1, 512, 512);
        case Ne.Box:
            return new C.DvJ(1, 1, 1, 1);
        case Ne.Sphere:
            return new C.xo$(.5, 32, 32);
        default:
            return new C._12(1, 1)
    }
}
