import { IPlot, IPlotsContainer } from './models/index';
import { Layout, Plot } from './models/index';
export declare let plots: IPlot[];
export declare const plotContainer: IPlotsContainer;
/**
 * Clears all stacked plots.
 */
export declare function clear(): void;
/**
 * Stacks plot data to a stack. When executing `plot`
 * the stack will also be plotted.
 * @param data
 * @param layout
 */
export declare function stack(data: Plot[], layout?: Layout): void;
/**
 * Plots the registered plots to a browser.
 * @param data
 * @param layout
 * @param cb
 */
export declare function plot(data?: Plot[] | null, layout?: Layout): void;
