import { GameState, Projectile } from "~/models/gameStateDescription";
import { getProjectileProgress, ProjectileType } from "~/models/projectile";

export function projectileThink(gameState: GameState, projectile: Projectile, timestamp: number) {
    const progress = getProjectileProgress(projectile.type, projectile.startTimestamp, timestamp);
    if (progress >= 1) {
        switch (projectile.type) {
            case ProjectileType.None:
                gameState.projectiles.splice(gameState.projectiles.indexOf(projectile), 1);
                return;
            case ProjectileType.Corn:
                const target = gameState.enemies.find((enemy) => enemy.id === projectile.targetId);
                if (target) {
                    target.health -= 4;
                    if (target.health <= 0) {
                        gameState.enemies.splice(gameState.enemies.indexOf(target), 1);
                    }
                }
                gameState.projectiles.splice(gameState.projectiles.indexOf(projectile), 1);
                return;
        }
    }
}
