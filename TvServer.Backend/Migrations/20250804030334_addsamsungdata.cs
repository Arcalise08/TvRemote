using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TvServerV2.Migrations
{
    /// <inheritdoc />
    public partial class addsamsungdata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SamsungDevices_SamsungAppData_SamsungAppsId",
                table: "SamsungDevices");

            migrationBuilder.DropIndex(
                name: "IX_SamsungDevices_SamsungAppsId",
                table: "SamsungDevices");

            migrationBuilder.DropColumn(
                name: "SamsungAppsId",
                table: "SamsungDevices");

            migrationBuilder.AddColumn<string>(
                name: "SavedSamsungDeviceEntityId",
                table: "SamsungAppData",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SamsungAppData_SavedSamsungDeviceEntityId",
                table: "SamsungAppData",
                column: "SavedSamsungDeviceEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_SamsungAppData_SamsungDevices_SavedSamsungDeviceEntityId",
                table: "SamsungAppData",
                column: "SavedSamsungDeviceEntityId",
                principalTable: "SamsungDevices",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SamsungAppData_SamsungDevices_SavedSamsungDeviceEntityId",
                table: "SamsungAppData");

            migrationBuilder.DropIndex(
                name: "IX_SamsungAppData_SavedSamsungDeviceEntityId",
                table: "SamsungAppData");

            migrationBuilder.DropColumn(
                name: "SavedSamsungDeviceEntityId",
                table: "SamsungAppData");

            migrationBuilder.AddColumn<string>(
                name: "SamsungAppsId",
                table: "SamsungDevices",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SamsungDevices_SamsungAppsId",
                table: "SamsungDevices",
                column: "SamsungAppsId");

            migrationBuilder.AddForeignKey(
                name: "FK_SamsungDevices_SamsungAppData_SamsungAppsId",
                table: "SamsungDevices",
                column: "SamsungAppsId",
                principalTable: "SamsungAppData",
                principalColumn: "Id");
        }
    }
}
