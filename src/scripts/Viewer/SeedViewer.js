export class SeedViewer{
    constructor(){
        this.seedPresenter = null;
    }

    registerWith(seedPresenter){
        this.seedPresenter = seedPresenter;
    }

    display(id, cavityElement){
        var seed = document.createElement("img");
        seed.setAttribute('id', seedId(id));
        seed.classList.add("img-seed");
        seed.style.top =  randSeedPositionTop();
        seed.style.left = randSeedPositionLeft();
        seed.src = randomSeedResource();
        cavityElement.appendChild(seed);
    }

    seedId(id){
        return 'seed-' + id;
    }
}