
/*
    Helper function. Used to create a creep.
                Parameters: body_type   =>  array containing the skills the screep will have.
                                            e.g. [CARRY, WORK, MOVE]
                            options     =>  json object that will hold the json options for the screep.
                                            e.g. {
                                                 memory:{
                                                state:"HARVEST",
                                                role:"Worker"
                                                }
                                            }
*/
function create_creep(body_type, options){
    // console.log(options.memory.role);
    let name = `${options.memory.role}_${Object.keys(Game.creeps).length+1}`;
    let number = Object.keys(Game.creeps).length;
    while(Game.creeps[name] != undefined)
    {
        number++;
        name = `${options.memory.role}_${number}`
    }
    for(const i in Game.spawns) {
        Game.spawns[i].spawnCreep(body_type, `${name}`, options);
    }
}

/*
    Creates a Worker Creep with the skills of [CARRY, WORK, MOVE]
*/
export function create_worker_creep() {
    let body_type = [CARRY, WORK, MOVE];
    let options = {
    memory:{
        state:"HARVEST",
        role:"Worker"
        }
    }
    for(const i in Game.spawns) {
        create_creep(body_type, options);   
    }
};


/*
    Creates a Worker Creep with the skills of [CARRY, WORK, MOVE]
*/
export function create_refiller_creep(){
    let body_type = [CARRY, WORK, MOVE];
    let options = {
    memory:{
        state:"HARVEST",
        role:"Refiller"
        }
    }
    for(const i in Game.spawns) {
        create_creep(body_type, options);   
    }
}

/*
    Creates a builder Creep with the skills of [CARRY, WORK, MOVE]
*/
export function create_builder_creep(){
    let body_type = [CARRY, WORK, MOVE];
    let options = {
    memory:{
        state:"HARVEST",
        role:"Builder"
        }
    }
    for(const i in Game.spawns) {
        create_creep(body_type, options);   
    }
}


/*
    Main screeps function used to manage all of the screeps.
*/
export function manage_creeps(){
    for(const i in Game.creeps){
        let creep = Game.creeps[i];
        Next_State(creep);
        Current_state(creep);
    }
}


/*
    Finds the nearest Construction Site, and begins building at that location to begin building.
*/
function Build(creep){
    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(target) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

/*
    Finds the SOurce, and begins Harvesting at that location to begin building.
*/
function Harvest(creep){
    const targets = creep.room.find(FIND_SOURCES);
    let target;
    if(targets.length){
        if(creep.memory.role == "Worker"){
            target = targets[0];
        }
        else {
            target = targets[0];
        }
        if(creep.harvest(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
        }
    }
}


function Refill(creep){
    const towers = creep.room.find(FIND_MY_STRUCTURES, {filter:{structureType:STRUCTURE_TOWER}});
    for(const i in towers){
        if(towers[i].energy < towers[i].energyCapacity){
            if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                // console.log(creep.moveTo(tower));
                creep.moveTo(tower);
                return;
            }
        }
    }
}



/*
    Holds the next state logic for each creep.
    When a creep in harvest mode reaches a full inventory, the creep will 
    switch state to either Upgrade or Building.

    If a creep in either Upgrade or Building mode, the creep will go back to harvest mode.

    Default mode is harvest.
*/
function Next_State(creep){
    switch(creep.memory.state){
        case "UPGRADE":
            if(_.sum(creep.carry) == 0){
                creep.memory.state = "HARVEST";
            }
        break;
        case "HARVEST":
            if(_.sum(creep.carry) == creep.carryCapacity){
                if(creep.memory.role == "Worker"){
                    creep.memory.state = "UPGRADE";
                }
                else if(creep.memory.role == "Refiller"){
                    creep.memory.state = "FILLING";
                }
                else {
                    creep.memory.state = "BUILDING";
                }
            }
        break;
        case "BUILDING":
            if(_.sum(creep.carry) == 0){
                creep.memory.state = "HARVEST";
            }
            else if(Object.keys(Game.structures).length == 0) {
                //If there isn't a construction site, the switch back to upgradeing.
                //TODO: I may loose out on a clock cycle here.
                creep.memory.state = "UPGRADE";
            }
        break;
        case "FILLING":
            if(_.sum(creep.carry) == 0){
                creep.memory.state = "HARVEST";
            }
            else if(Object.keys(Game.structures).length == 0) {
                //If there isn't a construction site, the switch back to upgradeing.
                //TODO: I may loose out on a clock cycle here.
                creep.memory.state = "UPGRADE";
            }
            else if(check_tower_energy(creep) == 0){
                creep.memory.state = "UPGRADE";
            }
        break;
        default:
            creep.memory.state = "HARVEST";
        break;
        
    }
}

function check_tower_energy(creep){
    const towers = creep.room.find(FIND_MY_STRUCTURES, {filter:{structureType:STRUCTURE_TOWER}});
    for(const i in towers){
        console.log("Tower energy ", towers[i].energy);
        if(towers[i].energy < towers[i].energyCapacity){
            return 1;
        }
    }
    return 0;
}


/*
    Performs the functionality of the current state for the creep.

*/
function Current_state(creep){
    switch(creep.memory.state){
        case "UPGRADE": 
            if(creep.room.controller){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);                        
                }
            }
            break;
        case "HARVEST":
            Harvest(creep);
            break;
        case "BUILDING":
            Build(creep);
            break;
        case "FILLING":
            Refill(creep);
            break;
        default:
            Harvest(creep);
            break;
    }

}

