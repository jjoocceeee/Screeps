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
    for(const i in Game.spawns) {
        Game.spawns[i].spawnCreep(body_type, `${options.memory.role}_${Object.keys(Game.creeps).length+1}`, options);
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

    if(targets.length){
        const target = targets[0];
        if(creep.harvest(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
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
                else {
                    creep.memory.state = "BUILDING";
                }
            }
        break;
        case "BUILDING":
            if(_.sum(creep.carry) == 0){
                creep.memory.state = "HARVEST";
            }
        break;
        default:
            creep.memory.state = "HARVEST";
        break;
        
    }
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
        default:
            Harvest(creep);
            break;
    }

}

