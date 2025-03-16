<script lang="ts" setup>
import useThree, { type SceneSettings } from '@/hooks/useThree'
import * as THREE from 'three'
const props = defineProps<{
    sceneSettings: SceneSettings
    vertexShader: string
    fragmentShader: string
    currentTopicData?: any
    iTime?: number
}>()

const container = ref<HTMLDivElement>()
let material: THREE.ShaderMaterial

const _getPixelData = ref<any>()

function getChannelImage(index: number) {
    return new URL(`../assets/channels/${props.currentTopicData.selectionName}_${props.currentTopicData.slug}_${index}.jpg`, import.meta.url).href
}

const textLoader = new THREE.TextureLoader()
onMounted(() => {
    const { scene, renderer, track, getPixelData, tick } = useThree(container.value as HTMLElement, props.sceneSettings)
    _getPixelData.value = getPixelData
    // 创建对象 
    let objects;
    if (props.sceneSettings.object) {
        objects = [props.sceneSettings.object]
    } else if (props.sceneSettings.objects) {
        objects = props.sceneSettings.objects
    }

    if (objects && objects.length > 0) {
        objects.forEach((obj: any) => {
            let geometry: THREE.BufferGeometry;

            // 根据几何体类型创建
            switch (obj.geometry) {
                case 1:
                    geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
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
            }
            if (props.currentTopicData?.channels) {
                props.currentTopicData.channels.forEach(({ index }: any) => {
                    const nameKey = `iChannel${index}`
                    const url = getChannelImage(index)
                    const texture = textLoader.load(url)
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
                    iChannels[nameKey].value = texture
                })
            }
            const { x, y } = renderer.getSize(new THREE.Vector2());

            material = new THREE.ShaderMaterial({
                vertexShader: props.vertexShader,
                fragmentShader: props.fragmentShader,
                transparent: true,
                uniforms: {
                    iResolution: { value: new THREE.Vector2(x, y) },
                    iTime: { value: props.iTime },
                    ...iChannels
                }
            });

            tick(() => {
                const { x, y } = renderer.getSize(new THREE.Vector2());
                material.uniforms.iTime.value = props.iTime
                material.uniforms.iResolution.value = new THREE.Vector2(x, y)
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
