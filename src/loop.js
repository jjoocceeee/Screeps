import { create_refiller_creep, create_worker_creep, create_builder_creep, manage_creeps } from './creeps';
export const loop = () =>
{   
    var num_of_builders = _.sum(Game.creeps, (c)=>c.memory.role == 'Builder');
    var num_of_refillers = _.sum(Game.creeps, (c)=>c.memory.role == 'Refiller');
    if(num_of_builders < 3){
        //create builder creep.
        create_builder_creep();
    }
    else if(num_of_refillers < 2){
        create_refiller_creep();
    }
    else{
        //create worker creep
        create_worker_creep();
    }

    manage_creeps();
    
}

