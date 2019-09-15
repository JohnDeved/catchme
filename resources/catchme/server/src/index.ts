import alt, { Player, Vehicle, ColshapeCircle, Colshape, Entity, emitClient } from 'alt'
import VehicleSpawnPoints from './data/SpawnPoints_Vehicles';
import GasStations from './data/GasStations';

// let target: Player | null

GasStations.forEach(({x, y}) => {
  const col = new ColshapeCircle(x, y, 20)
  col.setMeta('repair', true)
})

function getRandomSpawn() {
  const i = Math.floor(Math.random() * VehicleSpawnPoints.length)
  return VehicleSpawnPoints[i]
}

function playerRespawn(player: Player) {
  if (player.vehicle)
    player.vehicle.destroy()

  const spawnPos = getRandomSpawn()
  player.spawn(spawnPos.X, spawnPos.Y, spawnPos.Z, 0)
  const veh = new Vehicle('SULTAN', spawnPos.X, spawnPos.Y, spawnPos.Z, 0, 0, spawnPos.Heading)
  veh.setSyncedMeta('owner', player.id)
  veh.lockState = 4
}

alt.on('playerConnect', (player: Player) => {
  console.log(`Player ${player.name} (${player.ip}) connected! ${player.hwidHash} ${player.hwidExHash}`)
  player.model = 'a_m_y_skater_01'
  playerRespawn(player)
})

// function setTargetPlayer() {
//   const players: Player[] = Player.all
//   const player = players[Math.floor(Math.random() * players.length)]
//   if (player) {
//     if (player.vehicle) {
//       console.log('setting target')
//       player.vehicle.primaryColor = 92
//       player.vehicle.secondaryColor = 92
//       player.vehicle.modKit = 1
//       player.vehicle.setMod(22, 1)
//       player.vehicle.headlightColor = 15
//       target = player
//     }
//   }
// }

setInterval(() => {
  Vehicle.all.forEach((vehicle: Vehicle) => {
    if (!vehicle.driver)
      return vehicle.destroy()

    if (vehicle.engineHealth === 0 || !vehicle.engineOn)
      return playerRespawn(vehicle.driver)
  })

  Player.all.forEach((player: Player) => {
    if (!player.vehicle)
      playerRespawn(player)
  })

  // if (!target) {
  //   setTargetPlayer()
  // }

  // if (target) {
  //   if (!target.) {
  //     target = null;
  //   }
  // }
}, 5000)

alt.on('consoleCommand', (command: 'pos') => {
  if (command === 'pos') {
    Vehicle.all.forEach((vehicle: Vehicle) => {
      console.log(vehicle.pos)
    })
  }
});

alt.on('entityEnterColshape', (colshape: Colshape, entity: Entity) => {
  if (entity.type === 1) {
    const veh = entity as Vehicle
    const isRepair = colshape.getMeta('repair')
    if (isRepair) {
      veh.bodyHealth = 1000
      veh.bodyAdditionalHealth = 1000
      veh.engineHealth = 1000
      emitClient(null, 'healVehicle', veh)
    }
  }
});