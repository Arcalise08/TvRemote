using Microsoft.EntityFrameworkCore;
using TvServerV2.Models.Roku;
using TvServerV2.Models.Samsung;

namespace TvServerV2.Models;

public class AppDbContext : DbContext
{
    public DbSet<SavedSamsungDeviceEntity> SamsungDevices => Set<SavedSamsungDeviceEntity>();
    public DbSet<SavedRokuDeviceEntity> RokuDevices => Set<SavedRokuDeviceEntity>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
}