let scene, camera, renderer;

function init() {
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight*0.6);
document.getElementById("canvas-container").appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,5,5);
scene.add(light);

camera.position.z = 15;

animate();
}

function generate() {
clearScene();

let speakers = document.getElementById("speakers").value;
let monitors = document.getElementById("monitors").value;
let mics = document.getElementById("mics").value;

for(let i=0;i<speakers;i++){
let geo = new THREE.BoxGeometry(1,2,1);
let mat = new THREE.MeshBasicMaterial();
let mesh = new THREE.Mesh(geo,mat);
mesh.position.x = i*2 - speakers;
scene.add(mesh);
}

for(let i=0;i<monitors;i++){
let geo = new THREE.BoxGeometry(1,1,1);
let mat = new THREE.MeshBasicMaterial();
let mesh = new THREE.Mesh(geo,mat);
mesh.position.z = i*-2;
scene.add(mesh);
}

for(let i=0;i<mics;i++){
let geo = new THREE.SphereGeometry(0.3);
let mat = new THREE.MeshBasicMaterial();
let mesh = new THREE.Mesh(geo,mat);
mesh.position.x = (i%4)*2 - 4;
mesh.position.z = Math.floor(i/4)*-2;
scene.add(mesh);
}
}

function clearScene(){
while(scene.children.length > 0){ 
scene.remove(scene.children[0]); 
}
}

function exportPDF(){
let rider = document.getElementById("rider").value;

let doc = {
content: [
{text: "StageForge Pro Rider", style: "header"},
{text: rider}
]
};

pdfMake.createPdf(doc).download("rider.pdf");
}

function animate(){
requestAnimationFrame(animate);
renderer.render(scene,camera);
}

init();
