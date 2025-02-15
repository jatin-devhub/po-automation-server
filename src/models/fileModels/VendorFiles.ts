import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Vendor from "../vendor/Vendor";
import File from "../File";

@Table({
    timestamps: true,
    tableName: 'vendor_files'
})
export default class VendorFiles extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @ForeignKey(() => Vendor)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER
    })
    vendorId!: number;

    @ForeignKey(() => File)
    @Unique 
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    fileId!: number;

    @BelongsTo(() => File)
    file!: File

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}