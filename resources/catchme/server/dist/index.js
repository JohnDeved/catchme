"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alt_1 = __importStar(require("alt"));
const SpawnPoints_Vehicles_1 = __importDefault(require("./data/SpawnPoints_Vehicles"));
const GasStations_1 = __importDefault(require("./data/GasStations"));
let target;
GasStations_1.default.forEach(({ x, y }) => {
    const col = new alt_1.ColshapeCircle(x, y, 20);
    col.setMeta('repair', true);
});
function getRandomSpawn() {
    const i = Math.floor(Math.random() * SpawnPoints_Vehicles_1.default.length);
    return SpawnPoints_Vehicles_1.default[i];
}
function playerRespawn(player) {
    if (player.vehicle)
        player.vehicle.destroy();
    const spawnPos = getRandomSpawn();
    player.spawn(spawnPos.X, spawnPos.Y, spawnPos.Z, 0);
    const veh = new alt_1.Vehicle('SULTAN', spawnPos.X, spawnPos.Y, spawnPos.Z, 0, 0, spawnPos.Heading);
    veh.setSyncedMeta('owner', player.id);
    veh.lockState = 4;
}
alt_1.default.on('playerConnect', (player) => {
    console.log(`Player ${player.name} (${player.ip}) connected! ${player.hwidHash} ${player.hwidExHash}`);
    player.model = 'a_m_y_skater_01';
    playerRespawn(player);
});
function setTargetPlayer() {
    const players = alt_1.Player.all;
    const player = players[Math.floor(Math.random() * players.length)];
    if (player) {
        if (player.vehicle) {
            console.log('setting target');
            player.vehicle.primaryColor = 92;
            player.vehicle.secondaryColor = 92;
            player.vehicle.modKit = 1;
            player.vehicle.setMod(22, 1);
            player.vehicle.headlightColor = 15;
            target = player;
        }
    }
}
setInterval(() => {
    alt_1.Vehicle.all.forEach((vehicle) => {
        if (!vehicle.driver)
            return vehicle.destroy();
        if (vehicle.engineHealth === 0 || !vehicle.engineOn)
            return playerRespawn(vehicle.driver);
    });
    alt_1.Player.all.forEach((player) => {
        if (!player.vehicle)
            playerRespawn(player);
    });
    if (!target) {
        setTargetPlayer();
    }
    if (target) {
        if (!target.ping) {
            target = null;
        }
    }
}, 5000);
alt_1.default.on('consoleCommand', (command) => {
    if (command === 'pos') {
        alt_1.Vehicle.all.forEach((vehicle) => {
            console.log(vehicle.pos);
        });
    }
});
alt_1.default.on('entityEnterColshape', (colshape, entity) => {
    if (entity.type === 1) {
        const veh = entity;
        const isRepair = colshape.getMeta('repair');
        if (isRepair) {
            veh.bodyHealth = 1000;
            veh.bodyAdditionalHealth = 1000;
            veh.engineHealth = 1000;
            alt_1.emitClient(null, 'healVehicle', veh);
        }
    }
});
