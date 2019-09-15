import alt, { Player, PointBlip, RadiusBlip } from 'alt';
import { setPedIntoVehicle, setPedConfigFlag, setEntityInvincible, setVehicleFixed } from 'natives';
import GasStations from './data/GasStations';
GasStations.forEach(({ x, y, z }) => {
    const blip = new PointBlip(x, y, z);
    blip.name = 'Repair Vehicle';
    blip.sprite = 643;
    blip.shortRange = true;
    const shape = new RadiusBlip(x, y, z, 20);
    shape.name = 'Repair Vehicle';
    shape.color = 2;
    shape.alpha = 100;
});
alt.on('gameEntityCreate', (entity) => {
    if (entity.type === 1) {
        const player = Player.local;
        const owner = entity.getSyncedMeta('owner');
        if (owner === player.id) {
            if (!player.vehicle) {
                setPedIntoVehicle(player.scriptID, entity.scriptID, -1);
                setPedConfigFlag(player.scriptID, 32, false);
                setEntityInvincible(player.scriptID, true);
            }
        }
    }
});
alt.onServer('healVehicle', (veh) => {
    alt.log('healing vehicle');
    setVehicleFixed(veh.scriptID);
});
alt.on('update', () => {
});
