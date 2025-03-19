<script lang="ts" setup>
import useThree from '@/hooks/useThree'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// @ts-ignore
import { createBufferGeometry, createActions, setGeometryColor, createMaterial, setGeometryId, setGeometryColor2 } from '@/utils/createThree'

const props = defineProps<{
    vertexShader: string
    fragmentShader: string
    elapsedTime: number
    delta: number
}>()

const info = inject('info') as Ref<any>
const taskDetail = inject('taskDetail') as Ref<any>
const sceneSettings = computed(() => {
    return JSON.parse(taskDetail.value.sceneSettings)
})

const container = ref<HTMLDivElement>()
let material: THREE.ShaderMaterial

const _getPixelData = ref<any>()

function getChannelImage(index: number) {
    return new URL(`../assets/channels/${info.value.collect.slug}_${info.value.topic.slug}_${index}.jpg`, import.meta.url).href
}



const textLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')
// gltfLoader.setDRACOLoader(dracoLoader)
onMounted(async () => {
    THREE.ColorManagement.enabled = false
    const { scene, track, getPixelData, tick, viewPort, camera } = useThree(container.value as HTMLElement, sceneSettings.value)

    const depthRT = new THREE.WebGLRenderTarget(viewPort.value.width, viewPort.value.height, {
        format: 1028,
        type: 1015,
        depthBuffer: true,
        depthTexture: new THREE.DepthTexture(viewPort.value.width, viewPort.value.height, 1012),
        minFilter: 1003,
        magFilter: 1003,
        generateMipmaps: false
    });
    watch(viewPort, () => {
        depthRT.setSize(viewPort.value.width, viewPort.value.height)
    })

    _getPixelData.value = getPixelData
    const textures = []
    const channels = taskDetail.value.channels;
    for (let index = 0; index < channels.length; index++) {
        const url = getChannelImage(index)
        const texture = await textLoader.loadAsync(url)
        texture.magFilter = texture.minFilter = THREE.NearestFilter
        texture.needsUpdate = true
        textures.push(texture)
    }
    // 创建动画
    const actions = createActions(sceneSettings.value.actions)
    tick(() => {
        actions.forEach((action: any) => {
            action.update(props.delta, {
                camera,
                scene
            })
        })
        actions.time += props.delta / 1000
    })
    const mat1 = createMaterial(+sceneSettings.value.glslVersion, props.vertexShader, props.fragmentShader, props.elapsedTime, textures, 0, sceneSettings.value.properties)
    material = mat1;
    const mat2 = (sceneSettings.value.materials || []).map((pe: any) => createMaterial(+sceneSettings.value.glslVersion, pe.vertex, pe.fragment, props.elapsedTime, pe.textures, 0, pe.properties));

    const materials = [mat1, ...mat2]

    // 创建对象 
    let objects;
    if (sceneSettings.value.object) {
        objects = [sceneSettings.value.object]
    } else if (sceneSettings.value.objects) {
        objects = sceneSettings.value.objects
    }

    if (objects && objects.length > 0) {
        objects.forEach(async (object: any, index: number) => {
            let geometry
            let modelsArr: any[] = []
            let load_mesh = null
            if (object.geometry === '10') {
                const gltf = await gltfLoader.loadAsync('/' + object.model)
                load_mesh = gltf.scene
                gltf.scene.traverse((item: any) => {
                    if (item.isMesh) {
                        modelsArr.push(item)
                        setGeometryId(item.geometry, index);
                        const it = item.material.color;
                        it && setGeometryColor2(item.geometry, it.r, it.g, it.b, 1);
                    }
                })
            } else {
                geometry = createBufferGeometry(+object.geometry)
                geometry.computeVertexNormals()
                setGeometryColor(geometry, object.color)

            }

            let materialIndex = 0
            if(object.model){
                materialIndex = object.meshes.findIndex((item: any) => item.name === object.model.split('.')[0])
            }
            const materialId = object.meshes ? object.meshes[materialIndex]?.materialId : 0
            console.log("%c Line:122 🥚 materialId", "color:#fca650", materialId);
            const material = materials[materialId]
            tick(() => {
                material.uniforms.projectionMatrix.value = camera.projectionMatrix
                material.uniforms.viewMatrix.value = camera.matrixWorldInverse
                material.uniforms.inverseProjectionMatrix.value = new THREE.Matrix4().copy(camera.projectionMatrix).invert()
                material.uniforms.inverseViewMatrix.value = new THREE.Matrix4().copy(camera.matrixWorld)
                material.uniforms.iTime.value = props.elapsedTime
                material.uniforms.iResolution.value = new THREE.Vector2(viewPort.value.width, viewPort.value.height)
            })




            const mesh:any = load_mesh || new THREE.Mesh(geometry, material);

            if (mesh.isGroup) {
                mesh.traverse((item: any) => {
                    if (item.isMesh) {
                        item.material = material
                    }
                })
            }


            mesh.rotateY(object.rotation.y)
            mesh.rotateX(object.rotation.x)
            mesh.rotateZ(object.rotation.z)

            // 设置位置、旋转和缩放
            mesh.position.set(
                object.position.x,
                object.position.y,
                object.position.z
            );

            // 设置缩放
            mesh.scale.set(
                object.scale.x,
                object.scale.y,
                object.scale.z
            );

            // 添加到场景并跟踪资源
            scene.add(track(mesh));
        });
    }

})



defineExpose({
    updateMaterial: (vertexShader: string, fragmentShader: string) => {
        if (+sceneSettings.value.glslVersion === 3) {
            vertexShader = `\nprecision highp float;\nprecision highp int;\n\n${vertexShader}`;
            fragmentShader = `\nprecision highp float;\nprecision highp int;\n\n${fragmentShader}`;
        }

        material.vertexShader = vertexShader
        material.fragmentShader = fragmentShader
        material.needsUpdate = true
    },
    getPixelData: () => {
        return _getPixelData.value()
    }
})
</script>

<template>
    <div ref="container" class="three-canvas"></div>
</template>

<style lang="scss">
.three-canvas {
    width: 100%;
    height: 100%;

    canvas {
        width: 100% !important;
        height: 100% !important;
    }

    overflow: hidden;
    position: relative;
}
</style>
