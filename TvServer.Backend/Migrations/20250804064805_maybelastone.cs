using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TvServerV2.Migrations
{
    /// <inheritdoc />
    public partial class maybelastone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "LastKnownIp",
                table: "SamsungDevices",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "DeviceName",
                table: "SamsungDevices",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "SamsungDevices",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "DeviceInfoId",
                table: "SamsungDevices",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SavedSamsungDeviceEntityId",
                table: "SamsungAppData",
                type: "character varying(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LastKnownIp",
                table: "RokuDevices",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "DeviceName",
                table: "RokuDevices",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "RokuDevices",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "DeviceInfoId",
                table: "RokuDevices",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RokuDeviceInfo",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Udn = table.Column<string>(type: "text", nullable: false),
                    SerialNumber = table.Column<string>(type: "text", nullable: false),
                    DeviceId = table.Column<string>(type: "text", nullable: false),
                    AdvertisingId = table.Column<string>(type: "text", nullable: false),
                    VendorName = table.Column<string>(type: "text", nullable: false),
                    ModelName = table.Column<string>(type: "text", nullable: false),
                    ModelNumber = table.Column<string>(type: "text", nullable: false),
                    ModelRegion = table.Column<string>(type: "text", nullable: false),
                    IsTv = table.Column<bool>(type: "boolean", nullable: false),
                    IsStick = table.Column<bool>(type: "boolean", nullable: false),
                    ScreenSize = table.Column<int>(type: "integer", nullable: false),
                    PanelId = table.Column<int>(type: "integer", nullable: false),
                    MobileHasLiveTv = table.Column<bool>(type: "boolean", nullable: false),
                    UiResolution = table.Column<string>(type: "text", nullable: false),
                    TunerType = table.Column<string>(type: "text", nullable: false),
                    SupportsEthernet = table.Column<bool>(type: "boolean", nullable: false),
                    WifiMac = table.Column<string>(type: "text", nullable: false),
                    WifiDriver = table.Column<string>(type: "text", nullable: false),
                    HasWifi5GSupport = table.Column<bool>(type: "boolean", nullable: false),
                    EthernetMac = table.Column<string>(type: "text", nullable: false),
                    NetworkType = table.Column<string>(type: "text", nullable: false),
                    NetworkName = table.Column<string>(type: "text", nullable: false),
                    FriendlyDeviceName = table.Column<string>(type: "text", nullable: false),
                    FriendlyModelName = table.Column<string>(type: "text", nullable: false),
                    DefaultDeviceName = table.Column<string>(type: "text", nullable: false),
                    UserDeviceName = table.Column<string>(type: "text", nullable: false),
                    UserDeviceLocation = table.Column<string>(type: "text", nullable: false),
                    BuildNumber = table.Column<string>(type: "text", nullable: false),
                    SoftwareVersion = table.Column<string>(type: "text", nullable: false),
                    SoftwareBuild = table.Column<string>(type: "text", nullable: false),
                    LightningBaseBuildNumber = table.Column<string>(type: "text", nullable: false),
                    UiBuildNumber = table.Column<string>(type: "text", nullable: false),
                    UiSoftwareVersion = table.Column<string>(type: "text", nullable: false),
                    UiSoftwareBuild = table.Column<string>(type: "text", nullable: false),
                    SecureDevice = table.Column<bool>(type: "boolean", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    Locale = table.Column<string>(type: "text", nullable: false),
                    TimeZoneAuto = table.Column<bool>(type: "boolean", nullable: false),
                    TimeZone = table.Column<string>(type: "text", nullable: false),
                    TimeZoneName = table.Column<string>(type: "text", nullable: false),
                    TimeZoneTz = table.Column<string>(type: "text", nullable: false),
                    TimeZoneOffset = table.Column<int>(type: "integer", nullable: false),
                    ClockFormat = table.Column<string>(type: "text", nullable: false),
                    Uptime = table.Column<int>(type: "integer", nullable: false),
                    PowerMode = table.Column<string>(type: "text", nullable: false),
                    SupportsSuspend = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsFindRemote = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsAudioGuide = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsRva = table.Column<bool>(type: "boolean", nullable: false),
                    HasHandsFreeVoiceRemote = table.Column<bool>(type: "boolean", nullable: false),
                    DeveloperEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    KeyedDeveloperId = table.Column<string>(type: "text", nullable: false),
                    DeviceAutomationBridgeEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    SearchEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    SearchChannelsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    VoiceSearchEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsPrivateListening = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsPrivateListeningDtv = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsWarmStandby = table.Column<bool>(type: "boolean", nullable: false),
                    HeadphonesConnected = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsAudioSettings = table.Column<bool>(type: "boolean", nullable: false),
                    ExpertPqEnabled = table.Column<float>(type: "real", nullable: false),
                    SupportsEcsTextedit = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsEcsMicrophone = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsWakeOnWlan = table.Column<bool>(type: "boolean", nullable: false),
                    SupportsAirplay = table.Column<bool>(type: "boolean", nullable: false),
                    HasPlayOnRoku = table.Column<bool>(type: "boolean", nullable: false),
                    HasMobileScreensaver = table.Column<bool>(type: "boolean", nullable: false),
                    SupportUrl = table.Column<string>(type: "text", nullable: false),
                    GrandcentralVersion = table.Column<string>(type: "text", nullable: false),
                    SupportsTrc = table.Column<bool>(type: "boolean", nullable: false),
                    TrcVersion = table.Column<string>(type: "text", nullable: false),
                    TrcChannelVersion = table.Column<string>(type: "text", nullable: false),
                    AvSyncCalibrationEnabled = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RokuDeviceInfo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SamsungAdditionalDeviceInfo",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    FrameTVSupport = table.Column<string>(type: "text", nullable: true),
                    GamePadSupport = table.Column<string>(type: "text", nullable: true),
                    ImeSyncedSupport = table.Column<string>(type: "text", nullable: true),
                    Language = table.Column<string>(type: "text", nullable: true),
                    OS = table.Column<string>(type: "text", nullable: true),
                    PowerState = table.Column<string>(type: "text", nullable: true),
                    TokenAuthSupport = table.Column<string>(type: "text", nullable: true),
                    VoiceSupport = table.Column<string>(type: "text", nullable: true),
                    WallScreenRatio = table.Column<string>(type: "text", nullable: true),
                    WallService = table.Column<string>(type: "text", nullable: true),
                    CountryCode = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    DeveloperIP = table.Column<string>(type: "text", nullable: true),
                    DeveloperMode = table.Column<string>(type: "text", nullable: true),
                    Duid = table.Column<string>(type: "text", nullable: true),
                    FirmwareVersion = table.Column<string>(type: "text", nullable: true),
                    Ip = table.Column<string>(type: "text", nullable: true),
                    Model = table.Column<string>(type: "text", nullable: true),
                    ModelName = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: true),
                    NetworkType = table.Column<string>(type: "text", nullable: true),
                    Resolution = table.Column<string>(type: "text", nullable: true),
                    SmartHubAgreement = table.Column<string>(type: "text", nullable: true),
                    Ssid = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    Udn = table.Column<string>(type: "text", nullable: true),
                    WifiMac = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SamsungAdditionalDeviceInfo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SamsungTvInfo",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DeviceId = table.Column<string>(type: "text", nullable: true),
                    IsSupport = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Remote = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    Uri = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SamsungTvInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SamsungTvInfo_SamsungAdditionalDeviceInfo_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "SamsungAdditionalDeviceInfo",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_SamsungDevices_DeviceInfoId",
                table: "SamsungDevices",
                column: "DeviceInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_RokuDevices_DeviceInfoId",
                table: "RokuDevices",
                column: "DeviceInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_SamsungTvInfo_DeviceId",
                table: "SamsungTvInfo",
                column: "DeviceId");

            migrationBuilder.AddForeignKey(
                name: "FK_RokuDevices_RokuDeviceInfo_DeviceInfoId",
                table: "RokuDevices",
                column: "DeviceInfoId",
                principalTable: "RokuDeviceInfo",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SamsungDevices_SamsungTvInfo_DeviceInfoId",
                table: "SamsungDevices",
                column: "DeviceInfoId",
                principalTable: "SamsungTvInfo",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RokuDevices_RokuDeviceInfo_DeviceInfoId",
                table: "RokuDevices");

            migrationBuilder.DropForeignKey(
                name: "FK_SamsungDevices_SamsungTvInfo_DeviceInfoId",
                table: "SamsungDevices");

            migrationBuilder.DropTable(
                name: "RokuDeviceInfo");

            migrationBuilder.DropTable(
                name: "SamsungTvInfo");

            migrationBuilder.DropTable(
                name: "SamsungAdditionalDeviceInfo");

            migrationBuilder.DropIndex(
                name: "IX_SamsungDevices_DeviceInfoId",
                table: "SamsungDevices");

            migrationBuilder.DropIndex(
                name: "IX_RokuDevices_DeviceInfoId",
                table: "RokuDevices");

            migrationBuilder.DropColumn(
                name: "DeviceInfoId",
                table: "SamsungDevices");

            migrationBuilder.DropColumn(
                name: "DeviceInfoId",
                table: "RokuDevices");

            migrationBuilder.AlterColumn<string>(
                name: "LastKnownIp",
                table: "SamsungDevices",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "DeviceName",
                table: "SamsungDevices",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "SamsungDevices",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "SavedSamsungDeviceEntityId",
                table: "SamsungAppData",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LastKnownIp",
                table: "RokuDevices",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "DeviceName",
                table: "RokuDevices",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "RokuDevices",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);
        }
    }
}
