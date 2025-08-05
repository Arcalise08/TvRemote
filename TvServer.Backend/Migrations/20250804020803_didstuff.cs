using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TvServerV2.Migrations
{
    /// <inheritdoc />
    public partial class didstuff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Devices");

            migrationBuilder.CreateTable(
                name: "RokuApps",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RokuApps", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SamsungAppData",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    AppId = table.Column<string>(type: "text", nullable: false),
                    AppType = table.Column<int>(type: "integer", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: false),
                    IsLock = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SamsungAppData", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RokuApp",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Version = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    RokuAppsId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RokuApp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RokuApp_RokuApps_RokuAppsId",
                        column: x => x.RokuAppsId,
                        principalTable: "RokuApps",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RokuDevices",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DeviceName = table.Column<string>(type: "text", nullable: false),
                    LastKnownIp = table.Column<string>(type: "text", nullable: false),
                    RokuAppsId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RokuDevices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RokuDevices_RokuApps_RokuAppsId",
                        column: x => x.RokuAppsId,
                        principalTable: "RokuApps",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SamsungDevices",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DeviceName = table.Column<string>(type: "text", nullable: false),
                    LastKnownIp = table.Column<string>(type: "text", nullable: false),
                    SamsungAppsId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SamsungDevices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SamsungDevices_SamsungAppData_SamsungAppsId",
                        column: x => x.SamsungAppsId,
                        principalTable: "SamsungAppData",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RokuApp_RokuAppsId",
                table: "RokuApp",
                column: "RokuAppsId");

            migrationBuilder.CreateIndex(
                name: "IX_RokuDevices_RokuAppsId",
                table: "RokuDevices",
                column: "RokuAppsId");

            migrationBuilder.CreateIndex(
                name: "IX_SamsungDevices_SamsungAppsId",
                table: "SamsungDevices",
                column: "SamsungAppsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RokuApp");

            migrationBuilder.DropTable(
                name: "RokuDevices");

            migrationBuilder.DropTable(
                name: "SamsungDevices");

            migrationBuilder.DropTable(
                name: "RokuApps");

            migrationBuilder.DropTable(
                name: "SamsungAppData");

            migrationBuilder.CreateTable(
                name: "Devices",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DeviceName = table.Column<string>(type: "text", nullable: false),
                    DeviceType = table.Column<int>(type: "integer", nullable: false),
                    LastKnownIp = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Devices", x => x.Id);
                });
        }
    }
}
