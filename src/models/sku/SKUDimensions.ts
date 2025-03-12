import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import SKUDetails from "./SKUDetails";

@Table({
    tableName: 'sku_dimensions'
})
export default class SKUDimensions extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({ type: DataType.STRING })
    size!: string;

    @Column({ type: DataType.STRING })
    colorFamilyColor!: string;

    @Column({ type: DataType.FLOAT })
    productLengthCm!: number;

    @Column({ type: DataType.FLOAT })
    productBreadthCm!: number;

    @Column({ type: DataType.FLOAT })
    productHeightCm!: number;

    @Column({ type: DataType.FLOAT })
    productWeightKg!: number;

    @Column({ type: DataType.INTEGER })
    masterCartonQty!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonLengthCm!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonBreadthCm!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonHeightCm!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonWeightKg!: number;

    @ForeignKey(() => SKUDetails)
    @Column({ type: DataType.INTEGER })
    skuDetailsId!: number;
}