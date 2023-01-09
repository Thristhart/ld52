import { GameState, Projectile } from "~/models/gameStateDescription";
import { getProjectileProgress, ProjectileType } from "~/models/projectile";
import { damageEnemy } from "./enemyThink";

export function projectileThink(gameState: GameState, projectile: Projectile, timestamp: number) {
    const progress = getProjectileProgress(projectile.type, projectile.startTimestamp, timestamp);
    if (progress >= 1) {
        switch (projectile.type) {
            case ProjectileType.None:
                gameState.projectiles.splice(gameState.projectiles.indexOf(projectile), 1);
                return;
            case ProjectileType.Corn: {
                const target = gameState.enemies.find((enemy) => enemy.id === projectile.targetId);
                if (target) {
                    let kill = damageEnemy(gameState, target, 4);
                    if (kill) {
                        let killer = gameState.towers.find((x) => x.id === projectile.sourceId);
                        if (killer !== undefined) {
                            killer.kills += 1;
                        }
                    }
                }
                gameState.projectiles.splice(gameState.projectiles.indexOf(projectile), 1);
                return;
            }
            case ProjectileType.Coconut: {
                const target = gameState.enemies.find((enemy) => enemy.id === projectile.targetId);
                if (target) {
                    let kill = damageEnemy(gameState, target, 25);
                    if (kill) {
                        let killer = gameState.towers.find((x) => x.id === projectile.sourceId);
                        if (killer !== undefined) {
                            killer.kills += 1;
                        }
                    }
                }
                gameState.projectiles.splice(gameState.projectiles.indexOf(projectile), 1);
                return;
            }
        }
    }
}
