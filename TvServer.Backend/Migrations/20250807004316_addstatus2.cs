using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TvServerV2.Migrations
{
    /// <inheritdoc />
    public partial class addstatus2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "RokuDevices",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "RokuDevices");
        }
    }
}
