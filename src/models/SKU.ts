import {
    Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Vendor } from './Vendor';

@Table
class SKU extends Model {
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({ allowNull: false, unique: true, type: DataType.STRING })
    skuCode!: string;

    @Column({ allowNull: false, type: DataType.STRING })
    category!: string;

    @Column({ allowNull: false, type: DataType.STRING })
    productName!: string;

    @Column({ allowNull: false, type: DataType.STRING })
    hsn!: string;

    @Column({ allowNull: false, type: DataType.STRING })
    ean!: string;

    @Column({ allowNull: false, type: DataType.FLOAT })
    mrp!: number;

    @Column({ allowNull: false, field: 'product_length_cm', type: DataType.FLOAT })
    productLengthCm!: number;

    @Column({ allowNull: false, field: 'product_breadth_cm', type: DataType.FLOAT })
    productBreadthCm!: number;

    @Column({ allowNull: false, field: 'product_height_cm', type: DataType.FLOAT })
    productHeightCm!: number;

    @Column({ allowNull: false, field: 'product_weight_kg', type: DataType.FLOAT })
    productWeightKg!: number;

    @Column({ allowNull: false, field: 'master_carton_qty', type: DataType.INTEGER })
    masterCartonQty!: number;

    @Column({ allowNull: false, field: 'master_carton_length_cm', type: DataType.FLOAT })
    masterCartonLengthCm!: number;

    @Column({ allowNull: false, field: 'master_carton_breadth_cm', type: DataType.FLOAT })
    masterCartonBreadthCm!: number;

    @Column({ allowNull: false, field: 'master_carton_height_cm', type: DataType.FLOAT })
    masterCartonHeightCm!: number;

    @Column({ allowNull: false, field: 'master_carton_weight_kg', type: DataType.FLOAT })
    masterCartonWeightKg!: number;

    @ForeignKey(() => Vendor)
    @Column({ type: DataType.INTEGER })
    vendorId!: number;

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}

export default SKU;
