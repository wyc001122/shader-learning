<script lang="ts" setup>
import useThree from '@/hooks/useThree'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const props = defineProps<{
    vertexShader: string
    fragmentShader: string
    iTime: number
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
onMounted(() => {
    const { scene, renderer, track, getPixelData, tick, viewPort } = useThree(container.value as HTMLElement, sceneSettings.value)
    _getPixelData.value = getPixelData
    // 创建对象 
    let objects;
    if (sceneSettings.value.object) {
        objects = [sceneSettings.value.object]
    } else if (sceneSettings.value.objects) {
        objects = sceneSettings.value.objects
    }

    if (objects && objects.length > 0) {
        objects.forEach(async (obj: any) => {
            console.log("%c Line:41 🥕 obj", "color:#4fff4B", obj);
            let geometry: THREE.BufferGeometry;

            // 根据几何体类型创建
            switch (obj.geometry) {
                case "1":
                    geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
                    break;
                case "7":
                    geometry = new THREE.BufferGeometry();
                    {
                        const positionArr = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])
                        const indexArr = new Int32Array([0, 1, 2, 3, 4, 5])
                        const uvArr = new Float32Array([0, 0, 1, 0, .5, 1]);
                        geometry.setAttribute("position", new THREE.BufferAttribute(positionArr, 3))
                        geometry.setAttribute("index", new THREE.BufferAttribute(indexArr, 1))
                        geometry.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2))
                    }
                    break;
                case "8":
                    geometry = new THREE.BufferGeometry();
                    {
                        const positionArr = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                        const indexArr = new Int32Array([0, 1, 2, 3, 4, 5])
                        const uvArr = new Float32Array([0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1]);
                        geometry.setAttribute("position", new THREE.BufferAttribute(positionArr, 3))
                        geometry.setAttribute("index", new THREE.BufferAttribute(indexArr, 1))
                        geometry.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2))
                    }
                    break;
                default:
                    geometry = new THREE.BoxGeometry(1, 1, 1);
            }

            const iChannels: any = {
                iChannel0: {
                    value: null
                },
                iChannel1: {
                    value: null
                },
                iChannel2: {
                    value: null
                },
                iChannel3: {
                    value: null
                },
                iChannel4: {
                    value: null
                },
                iChannelSize0: {
                    value: new THREE.Vector2(0, 0)
                },
                iChannelSize1: {
                    value: new THREE.Vector2(0, 0)
                },
                iChannelSize2: {
                    value: new THREE.Vector2(0, 0)
                },
                iChannelSize3: {
                    value: new THREE.Vector2(0, 0)
                },
                iChannelSize4: {
                    value: new THREE.Vector2(0, 0)
                },
            }
            if (taskDetail.value.channels) {
                taskDetail.value.channels.forEach(({ index }: any) => {
                    const nameKey = `iChannel${index}`
                    const sizeKey = `iChannelSize${index}`
                    const url = getChannelImage(index)
                    textLoader.load(url, (texture) => {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
                        texture.magFilter = texture.minFilter = THREE.NearestFilter

                        iChannels[nameKey].value = texture
                        iChannels[sizeKey].value.set(texture.image.width, texture.image.height)

                        texture.needsUpdate = true
                        texture.colorSpace = THREE.SRGBColorSpace
                    })
                })
            }
            const { x, y } = renderer.getSize(new THREE.Vector2());
            material = new THREE.ShaderMaterial({
                vertexShader: props.vertexShader,
                fragmentShader: props.fragmentShader,
                transparent: true,
                uniforms: {
                    iResolution: { value: new THREE.Vector2(x, y) },
                    iTime: { value: 0 },
                    ...iChannels
                }
            });

            tick(() => {
                material.uniforms.iTime.value = props.iTime
                material.uniforms.iResolution.value = new THREE.Vector2(viewPort.value.width, viewPort.value.height)
            })

            const mesh = new THREE.Mesh(geometry, material);

            // 设置位置、旋转和缩放
            mesh.position.set(
                obj.position.x,
                obj.position.y,
                obj.position.z
            );

            mesh.rotation.set(
                obj.rotation.x,
                obj.rotation.y,
                obj.rotation.z
            );

            mesh.scale.set(
                obj.scale.x,
                obj.scale.y,
                obj.scale.z
            );

            // 添加到场景并跟踪资源
            scene.add(track(mesh));
        });
    }
})

defineExpose({
    updateMaterial: (vertexShader: string, fragmentShader: string) => {
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
