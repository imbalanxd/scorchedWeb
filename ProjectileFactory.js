function ProjectileFactory()
{
	this.spawnProjectile = function(position, velocity)
	{
		p = new Projectile(position);
		p.velocity = velocity;
	}
}