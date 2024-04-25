import { useTranslation } from 'react-i18next';
import Node from '../../lib/k8s/node';
import { getResourceMetrics } from '../../lib/util';
import { HoverInfoLabel } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';
import { UsageBarChart } from './Charts';
import { NodeReadyLabel } from './Details';
import { NodeTaintsLabel } from './utils';

export default function NodeList() {
  const [nodeMetrics, metricsError] = Node.useMetrics();
  const { t } = useTranslation(['glossary', 'translation']);

  const noMetrics = metricsError?.status === 404;

  return (
    <ResourceListView
      title={t('Nodes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={Node}
      columns={[
        'name',
        {
          id: 'cpu',
          label: t('CPU'),
          cellProps: {
            sx: { width: '20%' },
          },
          getter: node => {
            const [used] = getResourceMetrics(node, nodeMetrics || [], 'cpu');
            return used;
          },
          render: node => (
            <UsageBarChart
              node={node}
              nodeMetrics={nodeMetrics}
              resourceType="cpu"
              noMetrics={noMetrics}
            />
          ),
        },
        {
          id: 'memory',
          label: t('Memory'),
          cellProps: {
            sx: { width: '20%' },
          },
          getter: node => {
            const [used] = getResourceMetrics(node, nodeMetrics || [], 'memory');
            return used;
          },
          render: node => (
            <UsageBarChart
              node={node}
              nodeMetrics={nodeMetrics}
              resourceType="memory"
              noMetrics={noMetrics}
            />
          ),
        },
        {
          id: 'ready',
          label: t('translation|Ready'),
          getter: node => {
            const isReady = !!node.status.conditions.find(
              condition => condition.type === 'Ready' && condition.status === 'True'
            );
            return isReady ? t('translation|Yes') : t('translation|No');
          },
          render: node => <NodeReadyLabel node={node} />,
        },
        {
          id: 'taints',
          label: t('translation|Taints'),
          getter: node =>
            node.spec?.taints?.map(taint => `${taint.key}:${taint.effect}`)?.join(', '),
          render: (item: Node) => <NodeTaintsLabel node={item} />,
        },
        {
          id: 'roles',
          label: t('Roles'),
          getter: node => {
            return Object.keys(node.metadata.labels)
              .filter((t: String) => t.startsWith('node-role.kubernetes.io/'))
              .map(t => t.replace('node-role.kubernetes.io/', ''))
              .join(',');
          },
        },
        {
          id: 'internalIP',
          label: t('translation|Internal IP'),
          getter: node => node.getInternalIP(),
        },
        {
          id: 'externalIP',
          label: t('External IP'),
          getter: node => node.getExternalIP(),
        },
        {
          id: 'version',
          label: t('translation|Version'),
          getter: node => node.status.nodeInfo.kubeletVersion,
        },
        {
          id: 'software',
          label: t('translation|Software'),
          getter: node => node.status.nodeInfo.operatingSystem,
          render: node => {
            let osIcon = 'mdi:desktop-classic';
            if (node.status.nodeInfo.operatingSystem === 'linux') {
              osIcon = 'mdi:linux';
            } else if (node.status.nodeInfo.operatingSystem === 'windows') {
              osIcon = 'mdi:microsoft-windows';
            }

            return (
              <>
                <HoverInfoLabel
                  label={node.status.nodeInfo.osImage}
                  hoverInfo={t('OS image')}
                  labelProps={{ variant: 'body2' }}
                  iconPosition="start"
                  icon={osIcon}
                />
                {node.status.nodeInfo.kernelVersion && (
                  <HoverInfoLabel
                    label={node.status.nodeInfo.kernelVersion}
                    hoverInfo={t('Kernel version')}
                    labelProps={{ variant: 'body2' }}
                    iconPosition="start"
                    icon="mdi:nut"
                  />
                )}
                <HoverInfoLabel
                  label={node.status.nodeInfo.containerRuntimeVersion}
                  hoverInfo={t('Container Runtime')}
                  labelProps={{ variant: 'body2' }}
                  iconPosition="start"
                  icon="mdi:train-car-container"
                />
              </>
            );
          },
          show: false,
        },
        'age',
      ]}
    />
  );
}
