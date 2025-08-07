using Microsoft.EntityFrameworkCore;
using TvServer.Models.Roku;
using TvServer.Models.Samsung;

namespace TvServer.Models;

public class AppDbContext : DbContext
{
    public DbSet<SavedSamsungDeviceEntity> SamsungDevices => Set<SavedSamsungDeviceEntity>();
    public DbSet<SavedRokuDeviceEntity> RokuDevices => Set<SavedRokuDeviceEntity>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
}