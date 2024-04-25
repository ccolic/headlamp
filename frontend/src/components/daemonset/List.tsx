import { useTranslation } from 'react-i18next';
import { KubeContainer } from '../../lib/k8s/cluster';
import DaemonSet from '../../lib/k8s/daemonSet';
import { LightTooltip } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function DaemonSetList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Daemon Sets')}
      resourceClass={DaemonSet}
      columns={[
        'name',
        'namespace',
        {
          id: 'pods',
          label: t('Pods'),
          getter: daemonSet => daemonSet.status?.currentNumberScheduled || 0,
        },
        {
          id: 'currentPods',
          label: t('translation|Current'),
          getter: daemonSet => daemonSet.status?.currentNumberScheduled || 0,
        },
        {
          id: 'desiredPods',
          label: t('translation|Desired', { context: 'pods' }),
          getter: daemonSet => daemonSet.status?.desiredNumberScheduled || 0,
        },
        {
          id: 'readyPods',
          label: t('translation|Ready'),
          getter: daemonSet => daemonSet.status?.numberReady || 0,
        },
        {
          id: 'nodeSelector',
          label: t('Node Selector'),
          getter: daemonSet => daemonSet.getNodeSelectors().join(', '),
          render: daemonSet => {
            const selectors = daemonSet.getNodeSelectors();
            const nodeSelectorTooltip = selectors.join('\n');
            const nodeSelectorText = selectors.join(', ');
            return (
              <LightTooltip title={nodeSelectorTooltip} interactive>
                {nodeSelectorText}
              </LightTooltip>
            );
          },
        },
        {
          id: 'containers',
          label: t('Containers'),
          getter: daemonSet =>
            daemonSet
              .getContainers()
              .map((c: KubeContainer) => c.name)
              .join(', '),
          render: daemonSet => {
            const containerNames = daemonSet.getContainers().map((c: KubeContainer) => c.name);
            const containerText = containerNames.join(', ');
            const containerTooltip = containerNames.join('\n');
            return (
              <LightTooltip title={containerTooltip} interactive>
                {containerText}
              </LightTooltip>
            );
          },
        },
        {
          id: 'images',
          label: t('Images'),
          getter: daemonSet =>
            daemonSet
              .getContainers()
              .map((c: KubeContainer) => c.image)
              .join(', '),
          render: daemonSet => {
            const images = daemonSet.getContainers().map((c: KubeContainer) => c.image);
            const imageTooltip = images.join('\n');
            const imageText = images.join(', ');
            return (
              <LightTooltip title={imageTooltip} interactive>
                {imageText}
              </LightTooltip>
            );
          },
        },
        'age',
      ]}
    />
  );
}
