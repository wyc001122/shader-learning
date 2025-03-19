import { useElementSize, useDevicePixelRatio, } from '@vueuse/core'
import * as THREE from 'three';
import ResourceTracker from '@/utils/ResourceTracker';

export interface SceneSettings {
    camera: {
        position: {
            x: number,
            y: number,
            z: number
        },
        rotation: {
            x: number,
            y: number,
            z: number
        },
        isOrthographic: boolean,
        near: number,
        far: number,
        fov: number,
        left: number,
        right: number,
        top: number,
        bottom: number
    },
    object: {
        position: {
            x: number,
            y: number,
            z: number
        },
        rotation: {
            x: number,
            y: number,
            z: number
        },
        scale: {
            x: number,
            y: number,
            z: number
        },
        geometry: number,
        colorRGBA: string,
        color: number
    },
    objects: {
        position: {
            x: number,
            y: number,
            z: number
        },
        rotation: {
            x: number,
            y: number,
            z: number
        },
        scale: {
            x: number,
            y: number,
            z: number
        },
        geometry: number,
        colorRGBA: string,
        color: number
    }[],
    backgroundRGBA: string,
    background: number
}

export const useThree = (container: HTMLElement, sceneSettings: SceneSettings) => {
    const resourceTracker = new ResourceTracker();
    const track = resourceTracker.track.bind(resourceTracker);
    const { width, height } = useElementSize(container);
    const { pixelRatio } = useDevicePixelRatio();
    const defaultW = container.offsetWidth;
    const defaultH = container.offsetHeight;

    const viewPort = computed(() => ({
        width: (width.value || defaultW) * pixelRatio.value,
        height: (height.value || defaultH) * pixelRatio.value,
        viewWidth: width.value || defaultW,
        viewHeight: height.value || defaultH,
    }));

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
    });
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // 创建场景
    const scene = new THREE.Scene();

    // 设置背景色
    console.log("%c Line:113 🍡 sceneSettings", "color:#93c0a4", sceneSettings);
    scene.background = new THREE.Color(sceneSettings.background);

    // 创建相机
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

    if (sceneSettings.camera.isOrthographic) {
        camera = new THREE.OrthographicCamera(
            sceneSettings.camera.left,
            sceneSettings.camera.right,
            sceneSettings.camera.top,
            sceneSettings.camera.bottom,
            sceneSettings.camera.near,
            sceneSettings.camera.far
        );
    } else {
        // 透视相机
        camera = new THREE.PerspectiveCamera(
            sceneSettings.camera.fov,
            viewPort.value.width / viewPort.value.height,
            sceneSettings.camera.near,
            sceneSettings.camera.far
        );
    }
    // 设置相机位置和旋转
    camera.position.set(
        sceneSettings.camera.position.x,
        sceneSettings.camera.position.y,
        sceneSettings.camera.position.z
    );

    camera.rotateY(sceneSettings.camera.rotation.y)
    camera.rotateX(sceneSettings.camera.rotation.x)
    camera.rotateZ(sceneSettings.camera.rotation.z)

    const clock = new THREE.Clock();

    const _taskList: (() => void)[] = [];
    function tick(callback: () => void) {
        _taskList.push(callback);
    }

    let requestID: number = 0;
    function _runTask() {
        _taskList.forEach(task => task());
        // 渲染场景
        renderer.render(scene, camera);
        requestID = requestAnimationFrame(_runTask);
    }

    // 启动渲染循环
    _runTask();

    // 在组件卸载前清理资源
    onBeforeUnmount(() => {
        cancelAnimationFrame(requestID);
        resourceTracker.dispose();
        renderer.dispose();
    });

    // 窗口大小变化时更新相机和渲染器
    watch(viewPort, () => {
        const { width, height } = viewPort.value
        renderer.setSize(width, height, false);

        if (camera instanceof THREE.PerspectiveCamera) {
            camera.aspect = width / height;
        } else if (camera instanceof THREE.OrthographicCamera) {
            camera.left = sceneSettings.camera.left;
            camera.right = sceneSettings.camera.right;
            camera.top = sceneSettings.camera.top;
            camera.bottom = sceneSettings.camera.bottom;
            camera.near = sceneSettings.camera.near;
            camera.far = sceneSettings.camera.far;
        }
        camera.updateProjectionMatrix();

    });

    // 获取像素
    function getPixelData() {
        // 渲染一帧确保数据是最新的
        renderer.render(scene, camera);

        const width = renderer.domElement.width;
        const height = renderer.domElement.height;
        const buffer = new Uint8Array(width * height * 4);

        // 使用WebGL的readPixels方法读取像素
        const gl = renderer.getContext();
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);

        return {
            width,
            height,
            data: buffer
        };
    }

    return {
        /** 容器 */
        container,
        /** 渲染器 */
        renderer,
        /** 场景 */
        scene,
        /** 相机 */
        camera,
        /** 时钟 */
        clock,
        /** 画布尺寸 */
        viewPort,
        /** 添加帧循环 */
        tick,
        /** 手动调用，资源跟踪 */
        track,
        /** 获取像素 */
        getPixelData,
    };
};

export default useThree;