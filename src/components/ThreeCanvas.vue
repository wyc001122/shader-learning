<script lang="ts" setup>
import useThree from '@/hooks/useThree'
import * as THREE from 'three'

const props = defineProps<{
    vertexShader: string
    fragmentShader: string
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
            if (taskDetail.value.channels) {
                taskDetail.value.channels.forEach(({ index }: any) => {
                    const nameKey = `iChannel${index}`
                    const url = getChannelImage(index)
                    const texture = textLoader.load(url)
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
                    texture.magFilter = texture.minFilter = THREE.NearestFilter
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
                    // iTime: { value: props.iTime },
                    ...iChannels
                }
            });

            tick(() => {
                // material.uniforms.iTime.value = props.iTime
                material.uniforms.iResolution.value = new THREE.Vector2(~~viewPort.value.width, ~~viewPort.value.height)
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
